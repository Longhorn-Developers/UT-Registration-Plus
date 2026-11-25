import type { Serialized } from '@chrome-extension-toolkit';
import type { Course } from '@shared/types/Course';
import type { CustomBlock } from '@shared/types/CustomBlock';
import type { UserSchedule } from '@shared/types/UserSchedule';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { SYNC_PREFIX, type SyncStorage, syncSchedules } from './scheduleSync';

type SerializedSchedule = Serialized<UserSchedule>;
type SerializedCourse = Serialized<Course>;

// chrome.storage.sync's limits, counted the way Chrome counts them: the key and the value's JSON, in UTF-8 bytes
const QUOTA_BYTES_PER_ITEM = 8192;
const QUOTA_BYTES = 102400;
const utf8Bytes = (text: string) => new TextEncoder().encode(text).length;
const itemBytes = (key: string, value: unknown) => utf8Bytes(key) + utf8Bytes(JSON.stringify(value));
const PROBLEM_KEY = 'ScheduleSyncStore:problem';

/** A storage area like chrome.storage's, optionally with the sync storage's limits */
function createArea(limits?: { quotaBytes: number; maxItems?: number }) {
    let data: Record<string, unknown> = {};
    const area = {
        writes: 0,
        get data() {
            return data;
        },
        /** Replaces everything in it, e.g. to go back to what another computer saw */
        reset: (next: Record<string, unknown>) => {
            data = structuredClone(next);
        },
        get: async (keys: string[] | null) => {
            const picked =
                keys === null ? data : Object.fromEntries(keys.filter(k => k in data).map(k => [k, data[k]]));
            return structuredClone(picked);
        },
        set: async (items: Record<string, unknown>) => {
            area.writes += 1;
            const next = { ...data, ...structuredClone(items) };
            if (limits) {
                for (const [key, value] of Object.entries(items)) {
                    if (itemBytes(key, value) > QUOTA_BYTES_PER_ITEM) {
                        throw new Error('Resource::kQuotaBytesPerItem quota exceeded');
                    }
                }
                const total = Object.entries(next).reduce((sum, [key, value]) => sum + itemBytes(key, value), 0);
                if (total > limits.quotaBytes) throw new Error('Resource::kQuotaBytes quota exceeded');
                if (Object.keys(next).length > (limits.maxItems ?? 512)) {
                    throw new Error('Resource::kMaxItems quota exceeded');
                }
            }
            data = next;
        },
        remove: async (keys: string[]) => {
            area.writes += 1;
            data = Object.fromEntries(Object.entries(data).filter(([key]) => !keys.includes(key)));
        },
    };
    return area;
}

type Area = ReturnType<typeof createArea>;

/** A store like the extension's, over one computer's local storage. Like those, it hands out what it holds, not copies. */
function createStore(area: Area, prefix: string) {
    return {
        get: async (key: string) => area.data[prefix + key],
        set: async (key: string | Record<string, unknown>, value?: unknown) => {
            const values = typeof key === 'string' ? { [key]: value } : key;
            await area.set(Object.fromEntries(Object.entries(values).map(([k, v]) => [prefix + k, v])));
        },
    };
}

let cloud: Area;
let clock: number;

/** One computer: its own local storage and clock, sharing the synced storage with the others */
function createDevice(schedules: SerializedSchedule[], blocks: CustomBlock[] = [], clockOffset = 0) {
    const local = createArea();
    void local.set({ schedules, activeIndex: 0, 'CustomBlockStore:blocks': blocks });
    local.writes = 0;
    const stores = {
        schedules: createStore(local, ''),
        blocks: createStore(local, 'CustomBlockStore:'),
        syncState: createStore(local, 'ScheduleSyncStore:'),
    };
    const storage = {
        ...stores,
        sync: cloud,
        now: () => clock + clockOffset,
    } as unknown as SyncStorage;
    return {
        local,
        stores,
        sync: async () => {
            clock += 1000;
            return syncSchedules(storage);
        },
        get schedules() {
            return local.data.schedules as SerializedSchedule[];
        },
        get activeIndex() {
            return local.data.activeIndex as number;
        },
        get blocks() {
            return local.data['CustomBlockStore:blocks'] as CustomBlock[];
        },
        /** Opens another schedule, like the calendar does */
        open: (index: number) => {
            local.data.activeIndex = index;
        },
        /** Changes the schedules, like the extension's stores do */
        change: (update: (schedules: SerializedSchedule[]) => SerializedSchedule[]) => {
            local.data.schedules = update(structuredClone(local.data.schedules as SerializedSchedule[]));
        },
        /** Changes the first schedule */
        changeFirst: (update: (schedule: SerializedSchedule) => SerializedSchedule) => {
            const [first, ...rest] = structuredClone(local.data.schedules as SerializedSchedule[]);
            local.data.schedules = [update(first as SerializedSchedule), ...rest];
        },
    };
}

// A pseudo-random string, so the test data doesn't compress better than real course data
let seed = 1;
const randomText = (length: number) => {
    let text = '';
    while (text.length < length) {
        seed = (seed * 48271) % 2147483647;
        text += seed.toString(36);
    }
    return text.slice(0, length);
};

const course = (uniqueId: number, overrides: Partial<SerializedCourse> = {}): SerializedCourse =>
    ({
        uniqueId,
        number: '314',
        fullName: `C S 314 ${randomText(20)}`,
        courseName: randomText(20),
        department: 'C S',
        creditHours: 3,
        status: 'OPEN',
        instructors: [{ fullName: 'Ada Lovelace', firstName: 'Ada', lastName: 'Lovelace', middleInitial: '' }],
        isReserved: false,
        description: ['A long description that is not synced.'],
        schedule: {
            meetings: [{ days: ['Monday'], startTime: 600, endTime: 660, location: { building: 'GDC', room: '1' } }],
        },
        url: `https://utdirect.utexas.edu/apps/registrar/course_schedule/20262/${uniqueId}/`,
        flags: [],
        instructionMode: 'In Person',
        semester: { year: 2026, season: 'Spring', code: '20262' },
        scrapedAt: 1000,
        colors: { primaryColor: '#000000', secondaryColor: '#111111' },
        core: [],
        ...overrides,
    }) as SerializedCourse;

const schedule = (id: string, name: string, courses: SerializedCourse[] = []): SerializedSchedule => ({
    id,
    name,
    courses,
    hours: courses.length * 3,
    updatedAt: 1,
    lastCheckedAt: null,
    lastAttemptedAt: null,
});

const block = (id: string, scheduleId: string | null): CustomBlock => ({
    id,
    scheduleId,
    name: `Block ${id}`,
    days: ['Monday'],
    startTime: 480,
    endTime: 540,
    allDay: false,
    conflictHighlight: true,
});

const firstCourse = (s: SerializedSchedule) => s.courses[0] as SerializedCourse;
const names = (device: { schedules: SerializedSchedule[] }) => device.schedules.map(s => s.name);
const courseIds = (device: { schedules: SerializedSchedule[] }, name: string) =>
    device.schedules.find(s => s.name === name)?.courses.map(c => c.uniqueId);

beforeEach(() => {
    cloud = createArea({ quotaBytes: QUOTA_BYTES });
    clock = 1_000_000;
    seed = 1;
});

describe('syncSchedules', () => {
    it("gives a computer that starts syncing the other's schedules, without its own empty starting schedule", async () => {
        const laptop = createDevice([schedule('a', 'Fall plan', [course(1), course(2)]), schedule('b', 'Backup')]);
        await laptop.sync();

        const desktop = createDevice([schedule('fresh', 'Schedule 1')]);
        await desktop.sync();
        expect(names(desktop)).toEqual(['Fall plan', 'Backup']);
        expect(courseIds(desktop, 'Fall plan')).toEqual([1, 2]);
    });

    it("keeps the schedules a computer had with courses when it starts syncing, and adds them to the other's", async () => {
        const laptop = createDevice([schedule('a', 'Fall plan', [course(1)])]);
        await laptop.sync();

        const desktop = createDevice([schedule('d', 'Desktop plan', [course(5)])]);
        await desktop.sync();
        await laptop.sync();
        expect(names(desktop)).toEqual(['Fall plan', 'Desktop plan']);
        expect(names(laptop)).toEqual(['Fall plan', 'Desktop plan']);
    });

    it('copies an added course to the other computer, without syncing descriptions', async () => {
        const laptop = createDevice([schedule('a', 'Fall plan', [course(1)])]);
        await laptop.sync();
        const desktop = createDevice([]);
        await desktop.sync();

        laptop.changeFirst(s => ({ ...s, courses: [...s.courses, course(2)] }));
        await laptop.sync();
        await desktop.sync();
        expect(courseIds(desktop, 'Fall plan')).toEqual([1, 2]);
        expect(desktop.schedules[0]?.courses[1]?.description).toBeUndefined();
        expect(JSON.stringify(cloud.data)).not.toContain('not synced');
    });

    it('keeps the description and fresher data a computer has for a course another one changed', async () => {
        const laptop = createDevice([schedule('a', 'Fall plan', [course(1)])]);
        await laptop.sync();
        const desktop = createDevice([]);
        await desktop.sync();
        // The desktop refreshed the course since, and loaded its description
        desktop.changeFirst(s => ({
            ...s,
            courses: [{ ...firstCourse(s), status: 'CLOSED', scrapedAt: 5000, description: ['Loaded'] }],
        }));
        await desktop.sync();

        const newColors = { primaryColor: '#ff0000', secondaryColor: '#00ff00' } as const;
        laptop.changeFirst(s => ({ ...s, courses: [{ ...firstCourse(s), colors: newColors }] }));
        await laptop.sync();
        await desktop.sync();
        const synced = firstCourse(desktop.schedules[0] as SerializedSchedule);
        expect(synced.colors).toEqual(newColors);
        expect(synced.status).toBe('CLOSED');
        expect(synced.description).toEqual(['Loaded']);
    });

    it('deletes a schedule on the other computer, which then keeps it deleted', async () => {
        const laptop = createDevice([schedule('a', 'Fall plan'), schedule('b', 'Old plan', [course(1)])]);
        await laptop.sync();
        const desktop = createDevice([]);
        await desktop.sync();

        laptop.change(schedules => schedules.filter(s => s.id !== 'b'));
        await laptop.sync();
        await desktop.sync();
        await desktop.sync();
        await laptop.sync();
        expect(names(desktop)).toEqual(['Fall plan']);
        expect(names(laptop)).toEqual(['Fall plan']);
    });

    it('keeps a schedule one computer deleted when the other changed it before hearing so, rather than lose the change', async () => {
        const laptop = createDevice([schedule('a', 'Fall plan'), schedule('b', 'Shared plan', [course(1)])]);
        await laptop.sync();
        const desktop = createDevice([]);
        await desktop.sync();

        desktop.change(schedules =>
            schedules.map(s => (s.id === 'b' ? { ...s, courses: [...s.courses, course(2)] } : s))
        );
        await desktop.sync();
        // The laptop deletes it without having synced the desktop's change
        laptop.change(schedules => schedules.filter(s => s.id !== 'b'));
        await laptop.sync();
        await desktop.sync();
        expect(courseIds(laptop, 'Shared plan')).toEqual([1, 2]);
        expect(courseIds(desktop, 'Shared plan')).toEqual([1, 2]);
    });

    it('takes the later of two changes to the same schedule, even from a computer whose clock is behind', async () => {
        const laptop = createDevice([schedule('a', 'Plan', [course(1)])]);
        await laptop.sync();
        // An hour behind
        const desktop = createDevice([], [], -60 * 60 * 1000);
        await desktop.sync();

        laptop.changeFirst(s => ({ ...s, name: 'Laptop name' }));
        await laptop.sync();
        await desktop.sync();
        desktop.changeFirst(s => ({ ...s, name: 'Desktop name' }));
        await desktop.sync();
        await laptop.sync();
        expect(names(laptop)).toEqual(['Desktop name']);
        expect(names(desktop)).toEqual(['Desktop name']);
    });

    it("doesn't sync when only a course's data refreshed, which each computer does itself", async () => {
        const laptop = createDevice([schedule('a', 'Plan', [course(1)])]);
        await laptop.sync();
        const writes = cloud.writes;

        laptop.changeFirst(s => ({ ...s, courses: [{ ...firstCourse(s), status: 'WAITLISTED', scrapedAt: 9000 }] }));
        await laptop.sync();
        await laptop.sync();
        expect(cloud.writes).toBe(writes);
    });

    it('writes nothing when nothing changed', async () => {
        const laptop = createDevice([schedule('a', 'Plan', [course(1)])], [block('x', 'a')]);
        await laptop.sync();
        const desktop = createDevice([]);
        await desktop.sync();
        const [cloudWrites, laptopWrites, desktopWrites] = [cloud.writes, laptop.local.writes, desktop.local.writes];

        await laptop.sync();
        await desktop.sync();
        await laptop.sync();
        expect(cloud.writes).toBe(cloudWrites);
        // Only its own bookkeeping, not the schedules
        expect(laptop.local.writes - laptopWrites).toBe(2);
        expect(desktop.local.writes - desktopWrites).toBe(1);
        expect(laptop.schedules[0]?.courses[0]?.description).toEqual(['A long description that is not synced.']);
    });

    it('moves the schedules around like the other computer did, keeping the same one open', async () => {
        const laptop = createDevice([schedule('a', 'A'), schedule('b', 'B', [course(1)]), schedule('c', 'C')]);
        await laptop.sync();
        const desktop = createDevice([]);
        await desktop.sync();
        desktop.local.data.activeIndex = 1;

        laptop.change(([a, b, c]) => [c, a, b] as SerializedSchedule[]);
        await laptop.sync();
        await desktop.sync();
        expect(names(desktop)).toEqual(['C', 'A', 'B']);
        expect(desktop.schedules[desktop.activeIndex]?.name).toBe('B');
    });

    it('syncs a schedule too big for one sync item by splitting it up', async () => {
        const courses = Array.from({ length: 60 }, (_, i) => course(i, { courseName: randomText(400) }));
        const laptop = createDevice([schedule('a', 'Huge', courses)]);
        expect(await laptop.sync()).toBe('done');
        expect(Object.keys(cloud.data).filter(key => key.startsWith(`${SYNC_PREFIX}doc:s.a:`)).length).toBeGreaterThan(
            1
        );

        const desktop = createDevice([]);
        await desktop.sync();
        expect(courseIds(desktop, 'Huge')).toHaveLength(60);

        // Smaller again, so the parts it no longer needs go
        laptop.changeFirst(s => ({ ...s, courses: s.courses.slice(0, 1) }));
        await laptop.sync();
        expect(Object.keys(cloud.data).filter(key => key.startsWith(`${SYNC_PREFIX}doc:s.a:`))).toHaveLength(1);
        await desktop.sync();
        expect(courseIds(desktop, 'Huge')).toEqual([0]);
    });

    it('waits for all the parts of a change from another computer before taking it', async () => {
        const courses = Array.from({ length: 60 }, (_, i) => course(i, { courseName: randomText(400) }));
        const laptop = createDevice([schedule('a', 'Huge', courses)]);
        await laptop.sync();
        const desktop = createDevice([]);
        await desktop.sync();

        laptop.changeFirst(s => ({ ...s, courses: [...s.courses, course(99, { courseName: randomText(400) })] }));
        const before = structuredClone(cloud.data);
        await laptop.sync();
        // Only the header and the first part have arrived so far
        const arrived = structuredClone(cloud.data);
        const stillOld = Object.keys(before).filter(key => /:doc:s\.a:[1-9]/.test(key));
        for (const key of stillOld) cloud.data[key] = before[key];
        await desktop.sync();
        expect(courseIds(desktop, 'Huge')).toHaveLength(60);

        Object.assign(cloud.data, arrived);
        await desktop.sync();
        expect(courseIds(desktop, 'Huge')).toHaveLength(61);
    });

    it('says so when the sync storage is full, and still syncs deletions to free up space', async () => {
        cloud = createArea({ quotaBytes: 12000 });
        const big = (id: string) =>
            schedule(
                id,
                id,
                Array.from({ length: 30 }, (_, i) => course(i, { courseName: randomText(300) }))
            );
        const laptop = createDevice([big('a')]);
        await laptop.sync();
        expect(laptop.local.data[PROBLEM_KEY]).toBeNull();

        laptop.change(schedules => [...schedules, big('b')]);
        await laptop.sync();
        expect(laptop.local.data[PROBLEM_KEY]).toBe('storage-full');

        // Deleting the first frees up enough for the second
        laptop.change(schedules => schedules.filter(s => s.id !== 'a'));
        await laptop.sync();
        expect(laptop.local.data[PROBLEM_KEY]).toBeNull();
        const desktop = createDevice([]);
        await desktop.sync();
        expect(names(desktop)).toEqual(['b']);
    });

    it("syncs custom blocks, keeping both computers' when one starts syncing", async () => {
        const laptop = createDevice([schedule('a', 'Plan', [course(1)])], [block('x', 'a'), block('all', null)]);
        await laptop.sync();
        const desktop = createDevice([schedule('d', 'Desk', [course(2)])], [block('y', 'd')]);
        await desktop.sync();
        await laptop.sync();
        expect(desktop.blocks.map(b => b.id)).toEqual(['x', 'all', 'y']);
        expect(laptop.blocks.map(b => b.id)).toEqual(['x', 'all', 'y']);

        laptop.local.data['CustomBlockStore:blocks'] = laptop.blocks.filter(b => b.id !== 'all');
        await laptop.sync();
        await desktop.sync();
        expect(desktop.blocks.map(b => b.id)).toEqual(['x', 'y']);
    });

    it('keeps an empty schedule with blocks on it when its computer starts syncing', async () => {
        const laptop = createDevice([schedule('a', 'Plan', [course(1)])]);
        await laptop.sync();
        const desktop = createDevice([schedule('d', 'Gym', [])], [block('y', 'd')]);
        await desktop.sync();
        expect(names(desktop)).toEqual(['Plan', 'Gym']);
        expect(desktop.blocks.map(b => b.id)).toEqual(['y']);
    });

    it("doesn't sync a new install's empty schedule, even when it starts before the synced schedules arrive", async () => {
        const desktop = createDevice([schedule('fresh', 'Schedule 1')]);
        await desktop.sync();
        expect(cloud.data).toEqual({});

        const laptop = createDevice([schedule('a', 'Plan', [course(1)])]);
        await laptop.sync();
        await desktop.sync();
        await laptop.sync();
        expect(names(desktop)).toEqual(['Plan']);
        expect(names(laptop)).toEqual(['Plan']);
    });

    it('leaves an empty schedule when the other computer deleted them all', async () => {
        const laptop = createDevice([schedule('a', 'Plan', [course(1)])]);
        await laptop.sync();
        const desktop = createDevice([]);
        await desktop.sync();

        // Erase All replaces them with a new starting schedule
        laptop.change(() => [schedule('new', 'Schedule 1')]);
        await laptop.sync();
        await desktop.sync();
        expect(names(desktop)).toEqual(['Schedule 1']);
        expect(desktop.schedules[0]?.id).toBe('new');
    });

    it("doesn't give a computer a deleted schedule whose removal hasn't reached it yet", async () => {
        const laptop = createDevice([schedule('a', 'Plan', [course(1)]), schedule('b', 'Old', [course(2)])]);
        await laptop.sync();
        const before = structuredClone(cloud.data);

        laptop.change(schedules => schedules.filter(s => s.id !== 'b'));
        await laptop.sync();
        // The deletion has arrived, but the schedule's own items haven't been removed yet
        for (const [key, value] of Object.entries(before)) {
            if (key.includes(':doc:s.b')) cloud.data[key] = value;
        }
        const desktop = createDevice([]);
        await desktop.sync();
        expect(names(desktop)).toEqual(['Plan']);
    });

    it('settles on one order when two computers start syncing at the same time', async () => {
        const laptop = createDevice([schedule('a1', 'A1', [course(1)]), schedule('a2', 'A2', [course(2)])]);
        await laptop.sync();
        const before = structuredClone(cloud.data);

        // Both read the cloud before either wrote to it
        const desktop = createDevice([schedule('b1', 'B1', [course(3)])]);
        await desktop.sync();
        const desktopWrote = structuredClone(cloud.data);
        cloud.reset(before);
        const tablet = createDevice([schedule('c1', 'C1', [course(4)])]);
        await tablet.sync();
        // Chrome keeps the later write of the order, and both schedules
        cloud.reset({ ...desktopWrote, ...cloud.data });

        const round = async () => {
            await desktop.sync();
            await tablet.sync();
            await laptop.sync();
        };
        for (let i = 0; i < 3; i++) await round();
        const writes = cloud.writes;
        await round();
        await round();
        expect(cloud.writes).toBe(writes);
        expect(names(desktop)).toEqual(names(tablet));
        expect(names(laptop)).toEqual(names(tablet));
        expect([...names(laptop)].sort()).toEqual(['A1', 'A2', 'B1', 'C1']);
    });

    it("doesn't sync a new install's empty schedule when the synced schedules arrive in pieces", async () => {
        const courses = Array.from({ length: 60 }, (_, i) => course(i, { courseName: randomText(400) }));
        const laptop = createDevice([schedule('a', 'Huge', courses)]);
        await laptop.sync();
        const missing = `${SYNC_PREFIX}doc:s.a:1`;
        const part = cloud.data[missing];
        delete cloud.data[missing];

        const desktop = createDevice([schedule('fresh', 'Schedule 1')]);
        await desktop.sync();
        await desktop.sync();
        expect(names(desktop)).toEqual(['Schedule 1']);
        expect(Object.keys(cloud.data).some(key => key.includes('fresh'))).toBe(false);

        cloud.data[missing] = part;
        await desktop.sync();
        expect(names(desktop)).toEqual(['Huge']);
    });

    it("doesn't leave a schedule that's still arriving out of the synced order", async () => {
        const laptop = createDevice([schedule('a', 'A', [course(1)]), schedule('b', 'B', [course(2)])]);
        await laptop.sync();
        const desktop = createDevice([]);
        await desktop.sync();

        const big = schedule(
            'c',
            'C',
            Array.from({ length: 60 }, (_, i) => course(i, { courseName: randomText(400) }))
        );
        laptop.change(schedules => [big, ...schedules]);
        await laptop.sync();
        const missing = `${SYNC_PREFIX}doc:s.c:1`;
        const part = cloud.data[missing];
        delete cloud.data[missing];
        await desktop.sync();
        expect(names(desktop)).toEqual(['A', 'B']);

        cloud.data[missing] = part;
        await desktop.sync();
        await laptop.sync();
        expect(names(desktop)).toEqual(['C', 'A', 'B']);
        expect(names(laptop)).toEqual(['C', 'A', 'B']);
    });

    it('still syncs the schedules that fit when another one is too big for the sync storage', async () => {
        cloud = createArea({ quotaBytes: 12000 });
        const laptop = createDevice([schedule('a', 'Plan', [course(1)])]);
        await laptop.sync();
        const desktop = createDevice([]);
        await desktop.sync();

        const huge = schedule(
            'b',
            'Huge',
            Array.from({ length: 40 }, (_, i) => course(i, { courseName: randomText(300) }))
        );
        laptop.change(([a]) => [{ ...(a as SerializedSchedule), courses: [course(1), course(2)] }, huge]);
        await laptop.sync();
        expect(laptop.local.data[PROBLEM_KEY]).toBe('storage-full');
        await desktop.sync();
        expect(names(desktop)).toEqual(['Plan']);
        expect(courseIds(desktop, 'Plan')).toEqual([1, 2]);

        // It doesn't upload the one that fit again on every run while the other still doesn't
        const header = cloud.data[`${SYNC_PREFIX}doc:s.a`];
        await laptop.sync();
        expect(cloud.data[`${SYNC_PREFIX}doc:s.a`]).toEqual(header);
    });

    it('says the sync storage is full when it has too many items', async () => {
        cloud = createArea({ quotaBytes: QUOTA_BYTES, maxItems: 4 });
        const laptop = createDevice([schedule('a', 'A', [course(1)]), schedule('b', 'B', [course(2)])]);
        await laptop.sync();
        expect(laptop.local.data[PROBLEM_KEY]).toBe('storage-full');
    });

    it('stops writing once a change has reached the other computer', async () => {
        const laptop = createDevice([schedule('a', 'Plan', [course(1)])], [block('x', 'a')]);
        await laptop.sync();
        const desktop = createDevice([]);
        await desktop.sync();

        laptop.changeFirst(s => ({ ...s, courses: [...s.courses, course(2)] }));
        laptop.local.data['CustomBlockStore:blocks'] = [...laptop.blocks, block('y', null)];
        await laptop.sync();
        const writes = cloud.writes;
        await desktop.sync();
        await laptop.sync();
        await desktop.sync();
        expect(cloud.writes).toBe(writes);
        expect(courseIds(desktop, 'Plan')).toEqual([1, 2]);
    });

    it('deletes a schedule everywhere when the computer deleting it has its clock behind', async () => {
        const laptop = createDevice([schedule('a', 'Plan', [course(1)]), schedule('b', 'Old', [course(2)])]);
        await laptop.sync();
        // An hour behind
        const desktop = createDevice([], [], -60 * 60 * 1000);
        await desktop.sync();

        desktop.change(schedules => schedules.filter(s => s.id !== 'b'));
        await desktop.sync();
        await laptop.sync();
        await desktop.sync();
        expect(names(laptop)).toEqual(['Plan']);
        expect(names(desktop)).toEqual(['Plan']);
    });

    it("doesn't bring back a removed course on a computer that missed some changes in between", async () => {
        const laptop = createDevice([schedule('a', 'Plan', [course(1), course(2)])]);
        await laptop.sync();
        const desktop = createDevice([]);
        await desktop.sync();

        // The desktop is offline for both, so it only gets the last one
        laptop.changeFirst(s => ({ ...s, courses: s.courses.filter(c => c.uniqueId !== 1) }));
        await laptop.sync();
        laptop.changeFirst(s => ({ ...s, courses: [...s.courses, course(3)] }));
        await laptop.sync();
        await desktop.sync();
        await laptop.sync();
        expect(courseIds(desktop, 'Plan')).toEqual([2, 3]);
        expect(courseIds(laptop, 'Plan')).toEqual([2, 3]);
    });

    it('keeps a change one computer made to a block or color while the other changed something else', async () => {
        const laptop = createDevice([schedule('a', 'Plan', [course(1), course(2)])], [block('x', 'a')]);
        await laptop.sync();
        const desktop = createDevice([]);
        await desktop.sync();

        const red = { primaryColor: '#ff0000', secondaryColor: '#00ff00' } as const;
        desktop.changeFirst(s => ({
            ...s,
            courses: s.courses.map(c => (c.uniqueId === 1 ? { ...c, colors: red } : c)),
        }));
        desktop.local.data['CustomBlockStore:blocks'] = [{ ...block('x', 'a'), startTime: 600, endTime: 660 }];
        laptop.changeFirst(s => ({ ...s, courses: [...s.courses, course(3)] }));
        laptop.local.data['CustomBlockStore:blocks'] = [...laptop.blocks, block('n', null)];
        await laptop.sync();
        await desktop.sync();
        await laptop.sync();

        for (const device of [laptop, desktop]) {
            const plan = device.schedules[0] as SerializedSchedule;
            expect(plan.courses.map(c => c.uniqueId)).toEqual([1, 2, 3]);
            expect(firstCourse(plan).colors).toEqual(red);
            expect(device.blocks.map(b => [b.id, b.startTime])).toEqual([
                ['x', 600],
                ['n', 480],
            ]);
        }
    });

    it('settles when both computers upload a change with the same timestamp', async () => {
        const laptop = createDevice([schedule('a', 'Plan', [course(1)])]);
        await laptop.sync();
        // Its clock is behind by exactly the time between the two uploads below
        const desktop = createDevice([], [], -1000);
        await desktop.sync();

        laptop.changeFirst(s => ({ ...s, courses: [...s.courses, course(4)] }));
        desktop.changeFirst(s => ({ ...s, courses: [...s.courses, course(5)] }));
        const before = structuredClone(cloud.data);
        await laptop.sync();
        const laptopWrote = structuredClone(cloud.data);
        cloud.reset(before);
        await desktop.sync();
        expect((cloud.data[`${SYNC_PREFIX}doc:s.a`] as { m: number }).m).toBe(
            (laptopWrote[`${SYNC_PREFIX}doc:s.a`] as { m: number }).m
        );
        cloud.reset({ ...cloud.data, ...laptopWrote });

        for (let i = 0; i < 3; i++) {
            await desktop.sync();
            await laptop.sync();
        }
        expect(courseIds(desktop, 'Plan')?.sort()).toEqual([1, 4, 5]);
        expect(courseIds(laptop, 'Plan')?.sort()).toEqual([1, 4, 5]);
    });

    describe('when sync was off and both computers changed things', () => {
        it('merges the courses each one added and removed in the same schedule', async () => {
            const laptop = createDevice([schedule('a', 'Plan', [course(1), course(2), course(3)])]);
            await laptop.sync();
            const desktop = createDevice([]);
            await desktop.sync();

            laptop.changeFirst(s => ({
                ...s,
                name: 'Renamed',
                courses: [...s.courses.filter(c => c.uniqueId !== 1), course(4)],
            }));
            desktop.changeFirst(s => ({ ...s, courses: [...s.courses.filter(c => c.uniqueId !== 2), course(5)] }));
            await desktop.sync();
            await laptop.sync();
            await desktop.sync();

            for (const device of [laptop, desktop]) {
                expect(courseIds(device, 'Renamed')?.sort()).toEqual([3, 4, 5]);
            }
        });

        it('merges them when both computers sync at the same moment, as they do when sync comes back on', async () => {
            const laptop = createDevice([schedule('a', 'Plan', [course(1), course(2)])]);
            await laptop.sync();
            const desktop = createDevice([]);
            await desktop.sync();

            laptop.changeFirst(s => ({ ...s, courses: [...s.courses.filter(c => c.uniqueId !== 1), course(4)] }));
            desktop.changeFirst(s => ({ ...s, name: 'Renamed', courses: [...s.courses, course(5)] }));
            const before = structuredClone(cloud.data);
            await laptop.sync();
            const laptopWrote = structuredClone(cloud.data);
            cloud.reset(before);
            await desktop.sync();
            // Chrome keeps one of the two writes
            cloud.reset({ ...cloud.data, ...laptopWrote });

            for (let i = 0; i < 3; i++) {
                await desktop.sync();
                await laptop.sync();
            }
            for (const device of [laptop, desktop]) {
                expect(courseIds(device, 'Renamed')?.sort()).toEqual([2, 4, 5]);
            }
        });

        it('merges the blocks each one added and removed', async () => {
            const laptop = createDevice([schedule('a', 'Plan', [course(1)])], [block('x', 'a'), block('y', 'a')]);
            await laptop.sync();
            const desktop = createDevice([]);
            await desktop.sync();

            laptop.local.data['CustomBlockStore:blocks'] = [
                ...laptop.blocks.filter(b => b.id !== 'x'),
                block('l', 'a'),
            ];
            desktop.local.data['CustomBlockStore:blocks'] = [...desktop.blocks, block('d', null)];
            await laptop.sync();
            await desktop.sync();
            await laptop.sync();

            for (const device of [laptop, desktop]) {
                expect(device.blocks.map(b => b.id).sort()).toEqual(['d', 'l', 'y']);
            }
        });
    });

    it('keeps one schedule when every one was deleted, which the extension needs', async () => {
        const laptop = createDevice([schedule('a', 'Plan', [course(1)])]);
        await laptop.sync();
        const desktop = createDevice([]);
        await desktop.sync();

        // Caught between Erase All deleting them and making a new one
        laptop.change(() => []);
        await laptop.sync();
        await desktop.sync();
        expect(names(desktop)).toEqual(['Schedule 1']);
        expect(desktop.schedules[0]?.courses).toEqual([]);
    });

    it("doesn't take a change whose header arrived before its data, so it still takes it once the data arrives", async () => {
        const laptop = createDevice([schedule('a', 'Plan', [course(1)])]);
        await laptop.sync();
        const desktop = createDevice([]);
        await desktop.sync();

        laptop.changeFirst(s => ({ ...s, name: 'Renamed' }));
        const before = structuredClone(cloud.data);
        await laptop.sync();
        const arrived = structuredClone(cloud.data);
        const partKey = `${SYNC_PREFIX}doc:s.a:0`;
        cloud.data[partKey] = before[partKey];
        await desktop.sync();
        expect(names(desktop)).toEqual(['Plan']);

        cloud.data[partKey] = arrived[partKey];
        await desktop.sync();
        expect(names(desktop)).toEqual(['Renamed']);
    });

    it('keeps the description a computer loaded when the course comes back fresher from the other', async () => {
        const laptop = createDevice([schedule('a', 'Plan', [course(1)])]);
        await laptop.sync();
        const desktop = createDevice([]);
        await desktop.sync();
        desktop.changeFirst(s => ({ ...s, courses: [{ ...firstCourse(s), description: ['Loaded'] }] }));
        await desktop.sync();

        const newColors = { primaryColor: '#ff0000', secondaryColor: '#00ff00' } as const;
        laptop.changeFirst(s => ({
            ...s,
            courses: [{ ...firstCourse(s), colors: newColors, status: 'WAITLISTED', scrapedAt: 9000 }],
        }));
        await laptop.sync();
        await desktop.sync();
        const synced = firstCourse(desktop.schedules[0] as SerializedSchedule);
        expect(synced.status).toBe('WAITLISTED');
        expect(synced.description).toEqual(['Loaded']);
    });

    it('saves nothing here when the schedules change while it runs, and asks to run again', async () => {
        const laptop = createDevice([schedule('a', 'Plan', [course(1)])]);
        await laptop.sync();
        const desktop = createDevice([schedule('d', 'Desk', [course(2)])]);
        // The user adds a course on the desktop while the sync is reading the cloud
        const get = cloud.get;
        vi.spyOn(cloud, 'get').mockImplementationOnce(async keys => {
            desktop.changeFirst(s => ({ ...s, courses: [...s.courses, course(3)] }));
            return get(keys);
        });

        expect(await desktop.sync()).toBe('retry');
        expect(courseIds(desktop, 'Desk')).toEqual([2, 3]);
        expect(names(desktop)).toEqual(['Desk']);

        expect(await desktop.sync()).toBe('done');
        expect(names(desktop)).toEqual(['Plan', 'Desk']);
        expect(courseIds(desktop, 'Desk')).toEqual([2, 3]);
    });

    it('saves the active schedule only when it moves', async () => {
        const laptop = createDevice([schedule('a', 'A', [course(1)]), schedule('b', 'B', [course(2)])]);
        await laptop.sync();
        const desktop = createDevice([]);
        await desktop.sync();
        laptop.change(([a, b]) => [{ ...(a as SerializedSchedule), name: 'A2' }, b as SerializedSchedule]);
        await laptop.sync();

        const set = vi.spyOn(desktop.stores.schedules, 'set');
        await desktop.sync();
        expect(names(desktop)).toEqual(['A2', 'B']);
        expect(set.mock.calls.map(([values]) => Object.keys(values as object))).toEqual([['schedules']]);

        laptop.change(([a, b]) => [b as SerializedSchedule, a as SerializedSchedule]);
        await laptop.sync();
        set.mockClear();
        await desktop.sync();
        expect(names(desktop)).toEqual(['B', 'A2']);
        expect(desktop.activeIndex).toBe(1);
        expect(set.mock.calls.map(([values]) => Object.keys(values as object))).toEqual([['schedules', 'activeIndex']]);
    });

    it("keeps a computer's empty schedule when the user named it", async () => {
        const laptop = createDevice([schedule('a', 'Fall plan', [course(1)])]);
        await laptop.sync();
        const desktop = createDevice([schedule('fresh', 'Spring ideas')]);
        await desktop.sync();
        expect(names(desktop)).toEqual(['Fall plan', 'Spring ideas']);
        await laptop.sync();
        expect(names(laptop)).toEqual(['Fall plan', 'Spring ideas']);
    });

    it('keeps a starting schedule that only has custom blocks', async () => {
        const laptop = createDevice([schedule('a', 'Fall plan', [course(1)])]);
        await laptop.sync();
        const desktop = createDevice([schedule('fresh', 'Schedule 1')], [block('y', 'fresh')]);
        await desktop.sync();
        expect(names(desktop)).toEqual(['Fall plan', 'Schedule 1']);
    });

    it('uploads an empty schedule the user named, even before anything else syncs', async () => {
        const laptop = createDevice([schedule('a', 'Spring ideas')]);
        await laptop.sync();
        const desktop = createDevice([schedule('fresh', 'Schedule 1')]);
        await desktop.sync();
        expect(names(desktop)).toEqual(['Spring ideas']);
    });

    it('syncs names that are not plain ASCII', async () => {
        const laptop = createDevice([schedule('a', 'Plan d’été 🎓', [course(1, { courseName: 'Introducción ÁÉÍ' })])]);
        await laptop.sync();
        const desktop = createDevice([]);
        await desktop.sync();
        expect(names(desktop)).toEqual(['Plan d’été 🎓']);
        expect(firstCourse(desktop.schedules[0] as SerializedSchedule).courseName).toBe('Introducción ÁÉÍ');
        expect(Object.keys(cloud.data).every(key => /^[ -~]+$/.test(key))).toBe(true);
    });

    it('notices a change made in place to what the store handed out', async () => {
        const laptop = createDevice([schedule('a', 'Plan', [course(1)])]);
        await laptop.sync();
        const desktop = createDevice([]);
        await desktop.sync();
        laptop.changeFirst(s => ({ ...s, name: 'Renamed' }));
        await laptop.sync();

        // Something on the desktop edits the stored schedule itself, just before the sync checks for changes
        const get = desktop.stores.schedules.get;
        let reads = 0;
        vi.spyOn(desktop.stores.schedules, 'get').mockImplementation(async key => {
            if (key === 'schedules' && ++reads === 2) {
                (desktop.local.data.schedules as SerializedSchedule[])[0]?.courses.push(course(3));
            }
            return get(key);
        });

        expect(await desktop.sync()).toBe('retry');
        expect(await desktop.sync()).toBe('done');
        expect(names(desktop)).toEqual(['Renamed']);
        expect(courseIds(desktop, 'Renamed')).toEqual([1, 3]);
    });

    it('deletes a schedule on the other computer when the sync storage has no room for another item', async () => {
        // Room for exactly what two schedules take: a header and a part each, the custom blocks, and the order
        cloud = createArea({ quotaBytes: QUOTA_BYTES, maxItems: 7 });
        const laptop = createDevice([schedule('a', 'Old', [course(1)]), schedule('b', 'Plan', [course(2)])]);
        await laptop.sync();
        const desktop = createDevice([]);
        await desktop.sync();
        expect(names(desktop)).toEqual(['Old', 'Plan']);

        // The deletion marker is one more item, so the deleted schedule has to go first to make room for it
        laptop.change(schedules => schedules.filter(s => s.id !== 'a'));
        await laptop.sync();
        expect(cloud.data[`${SYNC_PREFIX}doc:s.a`]).toBeUndefined();
        expect(cloud.data[`${SYNC_PREFIX}gone:s.a`]).toBeDefined();

        await desktop.sync();
        expect(names(desktop)).toEqual(['Plan']);
    });

    it("keeps the schedule the user opens while the other computer's new order is arriving", async () => {
        const laptop = createDevice([schedule('a', 'A', [course(1)]), schedule('b', 'B', [course(2)])]);
        await laptop.sync();
        const desktop = createDevice([]);
        await desktop.sync();
        expect(names(desktop)).toEqual(['A', 'B']);
        expect(desktop.activeIndex).toBe(0);

        laptop.change(([a, b]) => [b as SerializedSchedule, a as SerializedSchedule]);
        await laptop.sync();

        // The user opens B while the sync is reading the synced schedules
        const get = cloud.get;
        vi.spyOn(cloud, 'get').mockImplementationOnce(async keys => {
            desktop.open(1);
            return get(keys);
        });

        await desktop.sync();
        expect(names(desktop)).toEqual(['B', 'A']);
        // B, which the user just opened, is the first one now
        expect(desktop.activeIndex).toBe(0);
    });

    it.each([
        ['Resource::kQuotaBytes quota exceeded', 'storage-full'],
        ['Resource::kQuotaBytesPerItem quota exceeded', 'storage-full'],
        ['Resource::kMaxItems quota exceeded', 'storage-full'],
        ['QUOTA_BYTES quota exceeded', 'storage-full'],
        ['MAX_ITEMS quota exceeded', 'storage-full'],
        ['This request exceeds the MAX_WRITE_OPERATIONS_PER_MINUTE quota.', null],
        ['This request exceeds the MAX_WRITE_OPERATIONS_PER_HOUR quota.', null],
        ['Resource::kMaxWriteOperationsPerMinute quota exceeded', null],
    ])('tells "%s" apart from other errors', async (message, problem) => {
        const laptop = createDevice([schedule('a', 'Plan', [course(1)])]);
        vi.spyOn(cloud, 'set').mockRejectedValue(new Error(message));
        expect(await laptop.sync()).toBe(problem ? 'done' : 'failed');
        expect(laptop.local.data[PROBLEM_KEY]).toBe(problem);
    });
});
