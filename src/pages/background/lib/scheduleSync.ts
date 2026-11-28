import type { Serialized } from '@chrome-extension-toolkit';
import { CustomBlockStore } from '@shared/storage/CustomBlockStore';
import { OptionsStore } from '@shared/storage/OptionsStore';
import { ScheduleSyncStore } from '@shared/storage/ScheduleSyncStore';
import { UserScheduleStore } from '@shared/storage/UserScheduleStore';
import type { Course } from '@shared/types/Course';
import type { CustomBlock } from '@shared/types/CustomBlock';
import type { ScheduleSyncDocEntry, ScheduleSyncProblem, ScheduleSyncState } from '@shared/types/ScheduleSync';
import type { UserSchedule } from '@shared/types/UserSchedule';
import { generateRandomId } from '@shared/util/random';

/**
 * Syncs the schedules and custom blocks through chrome.storage.sync. The local stores stay the source of truth: local
 * changes are copied up, and changes from other computers are copied down. Each schedule is its own compressed
 * document, split into parts when it's bigger than one sync item. When two computers changed the same document, their
 * changes are merged.
 */

type SerializedSchedule = Serialized<UserSchedule>;
type SerializedCourse = Serialized<Course>;

/** The stores and storage the sync uses, so tests can give each device its own */
export interface SyncStorage {
    schedules: Pick<typeof UserScheduleStore, 'get' | 'set'>;
    blocks: Pick<typeof CustomBlockStore, 'get' | 'set'>;
    syncState: Pick<typeof ScheduleSyncStore, 'get' | 'set'>;
    sync: Pick<chrome.storage.StorageArea, 'get' | 'set' | 'remove'>;
    now: () => number;
}

export const SYNC_PREFIX = 'scheduleSync:';
const SYNC_ORDER_KEY = `${SYNC_PREFIX}order`;
const docKey = (name: string) => `${SYNC_PREFIX}doc:${name}`;
const partKey = (name: string, index: number) => `${SYNC_PREFIX}doc:${name}:${index}`;
// Separate items, so two computers deleting at once don't overwrite each other's deletions
const goneKey = (name: string) => `${SYNC_PREFIX}gone:${name}`;
const SCHEDULE_DOC_KEY = /^scheduleSync:doc:s\.([^:]+)$/;

const SYNC_VERSION = 1;
// A sync item holds 8192 bytes, including its key
const PART_LENGTH = 8000;
const TOMBSTONE_MS = 1000 * 60 * 60 * 24 * 90;
// The alarm for the retry after a sync failed, which outlives the background worker going idle
const RETRY_ALARM = `${SYNC_PREFIX}retry`;

const BLOCKS_DOC = 'blocks';
const scheduleDoc = (id: string) => `s.${id}`;

interface SyncOrder {
    v: number;
    order: string[];
    orderAt: number;
}

/**
 * A document's header: when it was changed (m), how many parts it has (n), the hash of its data (h), which identifies
 * the version, and the hashes of the versions it came from, newest first (a)
 */
interface DocHeader {
    m: number;
    n: number;
    h: string;
    a: string[];
}

/** What a merge compares: the fingerprint, and a hash of each course or block by its key */
interface DocContent {
    fp: string;
    items: Record<string, string>;
}

type DocEntry = ScheduleSyncDocEntry;
type SyncState = ScheduleSyncState;

interface SchedulePayload {
    name: string;
    updatedAt: number;
    courses: SerializedCourse[];
}

const emptyOrder = (): SyncOrder => ({ v: SYNC_VERSION, order: [], orderAt: 0 });
const emptyState = (): SyncState => ({ v: SYNC_VERSION, initialized: false, docs: {}, orderFp: '', orderAt: 0 });

/** A 53-bit hash (cyrb53) */
export function hash(text: string): string {
    let h1 = 0xdeadbeef;
    let h2 = 0x41c6ce57;
    for (let i = 0; i < text.length; i++) {
        const ch = text.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
}

async function compress(text: string): Promise<string> {
    const stream = (new Response(text).body as ReadableStream).pipeThrough(new CompressionStream('deflate-raw'));
    const bytes = new Uint8Array(await new Response(stream).arrayBuffer());
    let binary = '';
    for (let i = 0; i < bytes.length; i += 0x8000) {
        binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
    }
    return btoa(binary);
}

async function decompress(base64: string): Promise<string> {
    const bytes = Uint8Array.from(atob(base64), ch => ch.charCodeAt(0));
    const stream = (new Response(bytes).body as ReadableStream).pipeThrough(new DecompressionStream('deflate-raw'));
    return new Response(stream).text();
}

const courseKey = (c: SerializedCourse) => `${c.uniqueId}:${c.semester.year}:${c.semester.season}`;

// Course statuses aren't part of it, since every device refreshes those itself
const scheduleFingerprint = (schedule: SerializedSchedule) =>
    hash(JSON.stringify([schedule.name, schedule.courses.map(c => [courseKey(c), c.colors])]));

const blocksFingerprint = (blocks: CustomBlock[]) => hash(JSON.stringify(blocks));

const NAME_ITEM = '#name';

const scheduleContent = (schedule: SerializedSchedule): DocContent => ({
    fp: scheduleFingerprint(schedule),
    items: {
        [NAME_ITEM]: hash(schedule.name),
        ...Object.fromEntries(schedule.courses.map(c => [courseKey(c), hash(JSON.stringify(c.colors))])),
    },
});

const blocksContent = (blocks: CustomBlock[]): DocContent => ({
    fp: blocksFingerprint(blocks),
    items: Object.fromEntries(blocks.map(b => [b.id, hash(JSON.stringify(b))])),
});

const MAX_ANCESTORS = 30;
const MAX_BASES = 3;
const lineage = (...hashes: string[]) => [...new Set(hashes)].slice(0, MAX_ANCESTORS);

/** Descriptions are left out, since the popup loads them when they're missing */
const toPayload = (schedule: SerializedSchedule): SchedulePayload => ({
    name: schedule.name,
    updatedAt: schedule.updatedAt,
    courses: schedule.courses.map(({ description: _description, ...course }) => course as SerializedCourse),
});

/** The schedule from another device, keeping this device's fresher course data and its descriptions */
function fromPayload(id: string, payload: SchedulePayload, local: SerializedSchedule | undefined): SerializedSchedule {
    const courses = payload.courses.map(course => {
        const localCourse = local?.courses.find(c => courseKey(c) === courseKey(course));
        if (!localCourse) return course;
        const fresher = (localCourse.scrapedAt ?? 0) > (course.scrapedAt ?? 0) ? localCourse : course;
        return { ...fresher, colors: course.colors, description: localCourse.description };
    });
    return {
        id,
        name: payload.name,
        courses,
        hours: courses.reduce((total, c) => total + c.creditHours, 0),
        updatedAt: payload.updatedAt,
        lastCheckedAt: local?.lastCheckedAt ?? null,
        lastAttemptedAt: local?.lastAttemptedAt ?? null,
    };
}

/**
 * Merges two versions of a list against the version both came from: keeps what either added, drops what either removed,
 * and takes the other's copy of an item only it changed. Without a base, it keeps everything from both.
 *
 * @param preferred - the version whose copy and order win when both changed an item
 */
export function mergeLists<T>(
    preferred: T[],
    other: T[],
    base: Record<string, string> | undefined,
    key: (item: T) => string,
    itemHash: (item: T) => string
): T[] {
    const otherByKey = new Map(other.map(item => [key(item), item]));
    const preferredKeys = new Set(preferred.map(key));
    const merged: T[] = [];
    for (const item of preferred) {
        const otherItem = otherByKey.get(key(item));
        const baseHash = base?.[key(item)];
        if (otherItem === undefined) {
            if (baseHash === undefined) merged.push(item);
        } else {
            merged.push(baseHash === itemHash(item) && baseHash !== itemHash(otherItem) ? otherItem : item);
        }
    }
    for (const item of other) {
        if (!preferredKeys.has(key(item)) && base?.[key(item)] === undefined) merged.push(item);
    }
    return merged;
}

const courseHash = (c: SerializedCourse) => hash(JSON.stringify(c.colors));
const blockHash = (b: CustomBlock) => hash(JSON.stringify(b));

async function encodeDoc(name: string, value: unknown, modifiedAt: number, ancestors: string[]) {
    const data = await compress(JSON.stringify(value));
    const h = hash(data);
    const partCount = Math.max(1, Math.ceil(data.length / PART_LENGTH));
    const header: DocHeader = { m: modifiedAt, n: partCount, h, a: ancestors };
    const items: Record<string, unknown> = { [docKey(name)]: header };
    for (let i = 0; i < partCount; i++) {
        items[partKey(name, i)] = `${h}|${data.slice(i * PART_LENGTH, (i + 1) * PART_LENGTH)}`;
    }
    return { items, partCount, h };
}

/** Returns undefined while some of the document's parts haven't arrived from another device yet */
async function decodeDoc<T>(name: string, remote: Record<string, unknown>): Promise<T | undefined> {
    const header = remote[docKey(name)] as DocHeader | undefined;
    if (!header) return undefined;
    let data = '';
    for (let i = 0; i < header.n; i++) {
        const part = remote[partKey(name, i)];
        if (typeof part !== 'string' || !part.startsWith(`${header.h}|`)) return undefined;
        data += part.slice(header.h.length + 1);
    }
    if (hash(data) !== header.h) return undefined;
    try {
        return JSON.parse(await decompress(data)) as T;
    } catch {
        return undefined;
    }
}

/** The keys of a document's parts from the given one on */
const partsFrom = (name: string, remote: Record<string, unknown>, from: number) =>
    Object.keys(remote).filter(key => {
        const prefix = `${docKey(name)}:`;
        return (
            key.startsWith(prefix) && /^\d+$/.test(key.slice(prefix.length)) && Number(key.slice(prefix.length)) >= from
        );
    });

// Chrome says e.g. "Resource::kQuotaBytes quota exceeded" (older versions "QUOTA_BYTES quota exceeded"). Writing too
// often is a different error, which a later retry gets past.
const isQuotaError = (error: unknown) => error instanceof Error && /quota_?bytes|max_?items/i.test(error.message);

/**
 * Brings this device's schedules and the synced ones together. When nothing changed, it writes nothing.
 *
 * @returns 'retry' when the schedules changed here while it ran, so it saved nothing locally; 'failed' when the sync
 * storage couldn't be written for a reason other than being full
 */
export async function syncSchedules(storage: SyncStorage): Promise<'done' | 'retry' | 'failed'> {
    const { sync, now } = storage;
    // Copies, since the stores hand out their in-memory values, which a change elsewhere can edit in place
    const schedules: SerializedSchedule[] = structuredClone((await storage.schedules.get('schedules')) ?? []);
    const blocks: CustomBlock[] = structuredClone((await storage.blocks.get('blocks')) ?? []);
    const savedState = await storage.syncState.get('state');
    const state = savedState?.v === SYNC_VERSION ? savedState : emptyState();

    const remote = await sync.get(null);
    const remoteOrder = (remote[SYNC_ORDER_KEY] as SyncOrder | undefined) ?? emptyOrder();
    if (remoteOrder.v > SYNC_VERSION) return 'done';

    const time = now();
    const nextState: SyncState = { v: SYNC_VERSION, initialized: true, docs: {}, orderFp: '', orderAt: 0 };
    const uploads: Record<string, unknown> = {};
    const docUploads: { name: string; items: Record<string, unknown>; removals: string[]; entry: DocEntry }[] = [];
    // Sent first, so they still go up and free space when the sync storage is full
    const deletions: Record<string, unknown> = {};
    const deletionRemovals: string[] = [];

    const remoteHeader = (name: string) => remote[docKey(name)] as DocHeader | undefined;
    const remoteDeletedAt = (name: string) => remote[goneKey(name)] as number | undefined;
    for (const key of Object.keys(remote)) {
        if (key.startsWith(goneKey('')) && time - (remote[key] as number) > TOMBSTONE_MS) deletionRemovals.push(key);
    }
    const remoteScheduleIds = Object.keys(remote)
        .map(key => SCHEDULE_DOC_KEY.exec(key)?.[1])
        .filter((id): id is string => id !== undefined);
    // The empty "Schedule 1" a new install starts with
    const isPlaceholder = (schedule: SerializedSchedule) =>
        schedule.name === 'Schedule 1' &&
        schedule.courses.length === 0 &&
        !blocks.some(b => b.scheduleId === schedule.id);
    // A new install waits for something to sync, so its placeholder doesn't show up on every other computer
    const hasContent = schedules.some(s => !isPlaceholder(s)) || blocks.length > 0;
    if (!state.initialized && !hasContent && remoteScheduleIds.length === 0) return 'done';
    const isJoining = !state.initialized && remoteScheduleIds.length > 0;

    // Later than the version it changed from, even with this device's clock behind
    const changedAt = (name: string) => Math.max(time, (state.docs[name]?.m ?? 0) + 1);

    const basesOf = (known: DocEntry | undefined) =>
        known ? [{ h: known.h, items: known.items }, ...(known.bases ?? [])].slice(0, MAX_BASES) : [];

    /** The latest version this device built on that the synced version came from too, which both changed from */
    const commonBase = (known: DocEntry | undefined, header: DocHeader) => {
        const remoteLineage = new Set(header.a ?? []);
        return basesOf(known).find(base => remoteLineage.has(base.h))?.items;
    };

    const upload = async (
        name: string,
        value: unknown,
        content: DocContent,
        m: number,
        ancestors: string[],
        bases: DocEntry['bases']
    ) => {
        const { items, partCount, h } = await encodeDoc(name, value, m, ancestors);
        const docRemovals = partsFrom(name, remote, partCount);
        if (remoteDeletedAt(name) !== undefined) docRemovals.push(goneKey(name));
        docUploads.push({ name, items, removals: docRemovals, entry: { ...content, h, m, a: ancestors, bases } });
    };

    const deletedNames: string[] = [];
    const removeRemote = (name: string, deletedAt: number) => {
        deletions[goneKey(name)] = deletedAt;
        deletedNames.push(name);
        if (remoteHeader(name)) deletionRemovals.push(docKey(name), ...partsFrom(name, remote, 0));
    };

    /** The synced version, as this device's last synced one */
    const remoteEntry = (header: DocHeader, content: DocContent): DocEntry => ({
        ...content,
        h: header.h,
        m: header.m,
        a: header.a ?? [],
    });

    const kept = new Map<string, SerializedSchedule>();
    // Whether a schedule from another device hasn't fully arrived yet
    let isArriving = false;

    const takeRemote = async (id: string) => {
        const name = scheduleDoc(id);
        const payload = await decodeDoc<SchedulePayload>(name, remote);
        if (!payload) {
            isArriving = true;
            return false;
        }
        const schedule = fromPayload(id, payload, undefined);
        kept.set(id, schedule);
        nextState.docs[name] = remoteEntry(remoteHeader(name) as DocHeader, scheduleContent(schedule));
        return true;
    };

    const droppedEmpty: SerializedSchedule[] = [];
    const localById = new Map(schedules.map(s => [s.id, s]));
    const knownIds = Object.keys(state.docs)
        .filter(name => name.startsWith('s.'))
        .map(name => name.slice(2));
    for (const id of new Set([...schedules.map(s => s.id), ...knownIds, ...remoteScheduleIds])) {
        const name = scheduleDoc(id);
        const localSchedule = localById.get(id);
        const known = state.docs[name];
        const header = remoteHeader(name);
        const deletedAt = remoteDeletedAt(name);

        if (localSchedule) {
            if (isJoining && !known && !header && isPlaceholder(localSchedule)) {
                droppedEmpty.push(localSchedule);
                continue;
            }
            const content = scheduleContent(localSchedule);
            const isChanged = known?.fp !== content.fp;
            const knownLineage = known ? lineage(known.h, ...known.a) : [];

            if (!header) {
                const localAt = known && !isChanged ? known.m : changedAt(name);
                // Otherwise another device deleted it after its last change here
                if (deletedAt === undefined || localAt > deletedAt) {
                    kept.set(id, localSchedule);
                    await upload(name, toPayload(localSchedule), content, localAt, knownLineage, basesOf(known));
                }
            } else if (known && header.h === known.h) {
                kept.set(id, localSchedule);
                if (isChanged) {
                    await upload(
                        name,
                        toPayload(localSchedule),
                        content,
                        changedAt(name),
                        knownLineage,
                        basesOf(known)
                    );
                } else {
                    nextState.docs[name] = known;
                }
            } else {
                const payload = await decodeDoc<SchedulePayload>(name, remote);
                if (!payload) {
                    isArriving = true;
                    kept.set(id, localSchedule);
                    if (known) nextState.docs[name] = known;
                    continue;
                }
                const remoteSchedule = fromPayload(id, payload, localSchedule);
                const base = commonBase(known, header);
                const isLocalName =
                    base?.[NAME_ITEM] === hash(remoteSchedule.name) && base[NAME_ITEM] !== hash(localSchedule.name);
                const courses = mergeLists(remoteSchedule.courses, localSchedule.courses, base, courseKey, courseHash);
                const merged: SerializedSchedule = {
                    ...remoteSchedule,
                    name: isLocalName ? localSchedule.name : remoteSchedule.name,
                    courses,
                    hours: courses.reduce((total, c) => total + c.creditHours, 0),
                };
                kept.set(id, merged);
                const mergedContent = scheduleContent(merged);
                if (mergedContent.fp === scheduleContent(remoteSchedule).fp) {
                    nextState.docs[name] = remoteEntry(header, mergedContent);
                } else {
                    const m = Math.max(changedAt(name), header.m + 1);
                    const ancestors = lineage(header.h, ...knownLineage, ...(header.a ?? []));
                    await upload(name, toPayload(merged), mergedContent, m, ancestors, basesOf(known));
                }
            }
        } else if (known) {
            // Deleted here since the last sync. A change from another device that this one never saw is kept instead.
            if (header && header.h !== known.h) {
                if (!(await takeRemote(id))) nextState.docs[name] = known;
            } else if (header || deletedAt === undefined) {
                removeRemote(name, changedAt(name));
            }
        } else if (header && !(deletedAt !== undefined && deletedAt >= header.m)) {
            await takeRemote(id);
        }
    }
    if (kept.size === 0) {
        for (const schedule of droppedEmpty) kept.set(schedule.id, schedule);
    }

    let nextBlocks = blocks;
    {
        const name = BLOCKS_DOC;
        const known = state.docs[name];
        const header = remoteHeader(name);
        const deletedAt = remoteDeletedAt(name);
        const content = blocksContent(blocks);
        const isChanged = known?.fp !== content.fp;
        const knownLineage = known ? lineage(known.h, ...known.a) : [];
        if (!header) {
            const m = known && !isChanged ? known.m : changedAt(name);
            if (deletedAt !== undefined && (m <= deletedAt || blocks.length === 0)) {
                // Another computer erased the blocks. Keeping it as the version this computer has means a block
                // added here later wins by its own version, not by whichever clock is further ahead.
                nextBlocks = [];
                const { h } = await encodeDoc(name, nextBlocks, deletedAt, []);
                nextState.docs[name] = { ...blocksContent(nextBlocks), h, m: deletedAt, a: [] };
            } else {
                await upload(name, blocks, content, m, knownLineage, basesOf(known));
            }
        } else if (known && header.h === known.h) {
            if (isChanged) await upload(name, blocks, content, changedAt(name), knownLineage, basesOf(known));
            else nextState.docs[name] = known;
        } else {
            const remoteBlocks = await decodeDoc<CustomBlock[]>(name, remote);
            if (!remoteBlocks) {
                if (known) nextState.docs[name] = known;
            } else {
                const base = commonBase(known, header);
                nextBlocks = mergeLists(remoteBlocks, blocks, base, b => b.id, blockHash);
                const mergedContent = blocksContent(nextBlocks);
                if (mergedContent.fp === blocksFingerprint(remoteBlocks)) {
                    nextState.docs[name] = remoteEntry(header, mergedContent);
                } else {
                    const m = Math.max(changedAt(name), header.m + 1);
                    await upload(
                        name,
                        nextBlocks,
                        mergedContent,
                        m,
                        lineage(header.h, ...knownLineage, ...(header.a ?? [])),
                        basesOf(known)
                    );
                }
            }
        }
    }

    // The device that rearranged the schedules last wins, with the ones it doesn't list after. A device that's just
    // started syncing lists its own schedules after the synced ones.
    const localOrder = schedules.map(s => s.id).filter(id => kept.has(id));
    const localOrderAt = isJoining
        ? 0
        : state.orderFp === hash(localOrder.join(','))
          ? state.orderAt
          : Math.max(time, state.orderAt + 1);
    // A tie means this device's order is the synced one, which also lists schedules still arriving here
    const [first, second] =
        localOrderAt > remoteOrder.orderAt ? [localOrder, remoteOrder.order] : [remoteOrder.order, localOrder];
    const order = [...new Set([...first, ...second, ...kept.keys()])].filter(id => kept.has(id));
    const orderAt = Math.max(localOrderAt, remoteOrder.orderAt);
    // Not while a schedule is still arriving, since the order would leave it out
    if (!isArriving && order.join(',') !== remoteOrder.order.join(',')) {
        uploads[SYNC_ORDER_KEY] = { v: SYNC_VERSION, order, orderAt } satisfies SyncOrder;
    }

    let nextSchedules = order.map(id => kept.get(id) as SerializedSchedule);
    if (nextSchedules.length === 0) {
        nextSchedules = [{ id: generateRandomId(), name: 'Schedule 1', courses: [], hours: 0, updatedAt: time }];
    }

    let problem: ScheduleSyncProblem = null;
    let isUploaded = true;
    let uploaded = docUploads;
    let areDeletionsMarked = true;
    let areDeletionsRemoved = false;
    try {
        if (Object.keys(deletions).length > 0) {
            areDeletionsMarked = false;
            try {
                await sync.set(deletions);
            } catch (error) {
                // Retrying the same write would fail the same way with nothing to free
                if (!isQuotaError(error) || deletionRemovals.length === 0) throw error;
                // No room for the markers, so the deleted documents go first to make some, or the deletion never
                // reaches the other computers and they keep the schedule
                await sync.remove(deletionRemovals);
                areDeletionsRemoved = true;
                await sync.set(deletions);
            }
            areDeletionsMarked = true;
        }
        // Only once the markers are up, so a document is never left without one for the other computers to upload again
        if (deletionRemovals.length > 0 && !areDeletionsRemoved) await sync.remove(deletionRemovals);
        const all = Object.assign({}, uploads, ...docUploads.map(doc => doc.items));
        try {
            if (Object.keys(all).length > 0) await sync.set(all);
        } catch (error) {
            if (!isQuotaError(error)) throw error;
            problem = 'storage-full';
            isUploaded = false;
            // One at a time, smallest first, so the ones that fit still go up
            const size = (doc: (typeof docUploads)[number]) => JSON.stringify(doc.items).length;
            uploaded = [];
            for (const doc of [...docUploads].sort((a, b) => size(a) - size(b))) {
                try {
                    await sync.set(doc.items);
                    uploaded.push(doc);
                } catch (docError) {
                    if (!isQuotaError(docError)) throw docError;
                }
            }
        }
        const removals = uploaded.flatMap(doc => doc.removals);
        if (removals.length > 0) await sync.remove(removals);
    } catch (error) {
        isUploaded = false;
        uploaded = [];
        if (isQuotaError(error)) problem = 'storage-full';
        else console.error('Failed to sync the schedules', error);
    }
    for (const doc of uploaded) nextState.docs[doc.name] = doc.entry;
    // A deletion whose marker never went up is made again on the next run, so it isn't forgotten here while
    // the document is gone and another computer could upload the schedule back
    if (!areDeletionsMarked) {
        for (const name of deletedNames) {
            const known = state.docs[name];
            if (known) nextState.docs[name] = known;
        }
    }
    // Still joining until everything has arrived, or its empty schedule would go up on the next run
    nextState.initialized = !(isJoining && isArriving);
    nextState.orderFp = hash(nextSchedules.map(s => s.id).join(','));
    nextState.orderAt = isUploaded ? orderAt : state.orderAt;

    // The next run picks up changes made here while this ran
    if (
        JSON.stringify((await storage.schedules.get('schedules')) ?? []) !== JSON.stringify(schedules) ||
        JSON.stringify((await storage.blocks.get('blocks')) ?? []) !== JSON.stringify(blocks)
    ) {
        return 'retry';
    }

    if (JSON.stringify(nextSchedules) !== JSON.stringify(schedules)) {
        // Read now, not before the cloud request, or switching schedules while that ran would be undone here
        const activeIndex = (await storage.schedules.get('activeIndex')) ?? 0;
        const activeId = schedules[activeIndex]?.id;
        const foundIndex = nextSchedules.findIndex(s => s.id === activeId);
        const nextActiveIndex = foundIndex === -1 ? Math.min(activeIndex, nextSchedules.length - 1) : foundIndex;
        // Only what changed: the store skips the change event for a key it set, and Chrome sends none for a value
        // that stayed the same, so the store would miss the next real change to it
        await storage.schedules.set(
            nextActiveIndex === activeIndex
                ? { schedules: nextSchedules }
                : { schedules: nextSchedules, activeIndex: nextActiveIndex }
        );
    }
    if (JSON.stringify(nextBlocks) !== JSON.stringify(blocks)) await storage.blocks.set('blocks', nextBlocks);
    // Last, so a sync cut off before this merges again instead of taking this device's schedules as its own changes
    await storage.syncState.set({ state: nextState, problem });
    return isUploaded || problem ? 'done' : 'failed';
}

/**
 * Marks the synced schedules this computer never downloaded as deleted, for Reset All Data. The schedules and custom
 * blocks it does have are erased by the sync that runs after, which sees them go from the stores; the ones it never
 * downloaded would arrive on that sync instead.
 *
 * @param storage - The stores and storage to use, so tests can give each device its own
 * @returns A promise that resolves once the sync storage has been marked
 */
export async function clearSyncedSchedules(
    storage: Pick<SyncStorage, 'sync' | 'syncState' | 'now'> = {
        sync: chrome.storage.sync,
        syncState: ScheduleSyncStore,
        now: Date.now,
    }
): Promise<void> {
    const { sync, now } = storage;
    try {
        const [remote, savedState] = await Promise.all([sync.get(null), storage.syncState.get('state')]);
        const order = remote[SYNC_ORDER_KEY] as SyncOrder | undefined;
        // A newer version of the sync wrote these, so leave them alone
        if (order !== undefined && order.v > SYNC_VERSION) return;
        const known = savedState?.v === SYNC_VERSION ? savedState.docs : {};
        const time = now();
        const markers: Record<string, number> = {};
        const removals: string[] = [];
        const mark = (name: string, header: DocHeader) => {
            // Later than the version being deleted, even with this computer's clock behind
            markers[goneKey(name)] = Math.max(time, header.m + 1);
            removals.push(docKey(name), ...partsFrom(name, remote, 0));
        };
        for (const key of Object.keys(remote)) {
            const id = SCHEDULE_DOC_KEY.exec(key)?.[1];
            if (id === undefined) continue;
            const header = remote[key] as DocHeader;
            // The sync erases the versions this computer has, since its schedules are about to go
            if (known[scheduleDoc(id)]?.h !== header.h) mark(scheduleDoc(id), header);
        }
        const blocksHeader = remote[docKey(BLOCKS_DOC)] as DocHeader | undefined;
        if (blocksHeader !== undefined && known[BLOCKS_DOC]?.h !== blocksHeader.h) mark(BLOCKS_DOC, blocksHeader);
        if (removals.length === 0) return;
        try {
            await sync.set(markers);
        } catch (error) {
            if (!isQuotaError(error)) throw error;
            // No room for the markers, so the schedules they delete go first to make some
            const removed = Object.fromEntries(removals.map(key => [key, remote[key]]));
            await sync.remove(removals);
            try {
                await sync.set(markers);
            } catch (retryError) {
                // Put them back rather than leave them with nothing to say they were deleted, which would have the
                // other computers upload them again
                await sync.set(removed);
                throw retryError;
            }
            return;
        }
        await sync.remove(removals);
    } catch (error) {
        // The sync still erases everything this computer downloaded, so don't hold the reset up for this
        console.error('Failed to clear the schedules this computer never downloaded', error);
    }
}

/**
 * Syncs the schedules when the background starts and after every change to them, here or on another device, while
 * the user has syncing turned on
 */
export function startScheduleSync(): void {
    let timer: ReturnType<typeof setTimeout> | undefined;
    let running = Promise.resolve();
    const storage: SyncStorage = {
        schedules: UserScheduleStore,
        blocks: CustomBlockStore,
        syncState: ScheduleSyncStore,
        sync: chrome.storage.sync,
        now: Date.now,
    };

    const run = async () => {
        if (!(await OptionsStore.get('enableScheduleSync'))) {
            // Otherwise a retry left over from before it was turned off still wakes the background worker once
            await chrome.alarms.clear(RETRY_ALARM);
            return;
        }
        const result = await syncSchedules(storage);
        if (result === 'failed') {
            // An alarm, not a timer: Chrome can stop the idle background worker long before a minute is up
            await chrome.alarms.create(RETRY_ALARM, { delayInMinutes: 1 });
            return;
        }
        await chrome.alarms.clear(RETRY_ALARM);
        if (result === 'retry') queueSync(500);
    };

    function queueSync(delay: number) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            running = running.then(run).catch(error => console.error('Failed to sync the schedules', error));
        }, delay);
    }

    // Waits a little, so a burst of changes goes up as one
    UserScheduleStore.subscribe('schedules', () => queueSync(1500));
    CustomBlockStore.subscribe('blocks', () => queueSync(1500));
    OptionsStore.subscribe('enableScheduleSync', ({ newValue }) => {
        if (newValue) queueSync(0);
    });
    chrome.storage.onChanged.addListener((changes, area) => {
        if (area === 'sync' && Object.keys(changes).some(key => key.startsWith(SYNC_PREFIX))) queueSync(300);
    });
    chrome.alarms.onAlarm.addListener(alarm => {
        if (alarm.name === RETRY_ALARM) queueSync(0);
    });

    queueSync(0);
}
