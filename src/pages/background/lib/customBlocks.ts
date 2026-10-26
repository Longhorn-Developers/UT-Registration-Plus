import { CustomBlockStore } from '@shared/storage/CustomBlockStore';
import { UserScheduleStore } from '@shared/storage/UserScheduleStore';
import type { CustomBlock, CustomBlockDraft } from '@shared/types/CustomBlock';
import { customBlockFromDraft, customBlockToDraft } from '@shared/util/customBlocks';
import { generateRandomId } from '@shared/util/random';

let pending: Promise<void> = Promise.resolve();

function writeBlocks<T>(change: (blocks: CustomBlock[]) => Promise<{ blocks: CustomBlock[]; result: T }>): Promise<T> {
    const operation = pending.then(async () => {
        const previous = await CustomBlockStore.get('blocks');
        const { blocks, result } = await change(previous);
        try {
            await CustomBlockStore.set('blocks', blocks);
        } catch (error) {
            await CustomBlockStore.set('blocks', previous).catch(() => undefined);
            throw error;
        }
        return result;
    });
    pending = operation.then(
        () => undefined,
        () => undefined
    );
    return operation;
}

async function requireSchedule(scheduleId: string) {
    const schedules = await UserScheduleStore.get('schedules');
    if (!schedules.some(schedule => schedule.id === scheduleId)) throw new Error('Schedule does not exist');
    return schedules;
}

/**
 * Checks if two blocks look the same on the calendar
 *
 * @param a - The first block
 * @param b - The second block
 * @returns True if the name, color, days, and times match
 */
function isSameBlock(a: CustomBlock, b: CustomBlock) {
    return (
        a.name === b.name &&
        a.color === b.color &&
        a.allDay === b.allDay &&
        a.days.join() === b.days.join() &&
        (a.allDay || (a.startTime === b.startTime && a.endTime === b.endTime))
    );
}

/**
 * Removes blocks that duplicate a synced block, so it isn't shown twice on a schedule
 *
 * @param blocks - The blocks to filter
 * @param synced - The block to keep
 * @returns The blocks without duplicates of the synced block
 */
function withoutDuplicates(blocks: CustomBlock[], synced: CustomBlock) {
    if (synced.scheduleId !== null) return blocks;
    return blocks.filter(block => block.id === synced.id || !isSameBlock(block, synced));
}

/**
 * Gets the values the other schedules keep when a synced block is unsynced
 *
 * @param previous - The stored synced block
 * @param draftAtUnsync - The draft when sync was turned off
 * @returns The block from the draft, or the stored block if the draft is missing or invalid
 */
function valuesAtUnsync(previous: CustomBlock, draftAtUnsync?: CustomBlockDraft): CustomBlock {
    if (!draftAtUnsync) return previous;
    try {
        return customBlockFromDraft(draftAtUnsync, '', previous.id);
    } catch {
        return previous;
    }
}

export function createCustomBlock(draft: CustomBlockDraft, scheduleId: string): Promise<CustomBlock> {
    return writeBlocks(async blocks => {
        await requireSchedule(scheduleId);
        const block = customBlockFromDraft(draft, scheduleId, generateRandomId());
        return { blocks: [...withoutDuplicates(blocks, block), block], result: block };
    });
}

export function updateCustomBlock(
    id: string,
    draft: CustomBlockDraft,
    scheduleId: string,
    draftAtUnsync?: CustomBlockDraft
): Promise<CustomBlock> {
    return writeBlocks(async blocks => {
        const schedules = await requireSchedule(scheduleId);
        const previous = blocks.find(block => block.id === id);
        if (!previous) throw new Error('Custom block does not exist');
        const updated = customBlockFromDraft(draft, scheduleId, id);
        // An edited copy is the user's own block now, so resyncing must not replace it
        if (!isSameBlock(previous, updated) || previous.conflictHighlight !== updated.conflictHighlight) {
            delete updated.unsyncedFrom;
        }
        const next = blocks.map(block => (block.id === id ? updated : block));
        if (previous.scheduleId === null && updated.scheduleId !== null) {
            const values = valuesAtUnsync(previous, draftAtUnsync);
            const copies = schedules
                .filter(schedule => schedule.id !== scheduleId)
                .map(schedule => ({ ...values, id: generateRandomId(), scheduleId: schedule.id, unsyncedFrom: id }));
            return { blocks: [...next, ...copies], result: updated };
        }
        if (previous.scheduleId !== null && updated.scheduleId === null) {
            // Resyncing replaces the copies nobody edited; edited copies stay beside it for the user to keep or delete
            const resynced = next.filter(block => block.unsyncedFrom !== id);
            return { blocks: withoutDuplicates(resynced, updated), result: updated };
        }
        return { blocks: withoutDuplicates(next, updated), result: updated };
    });
}

export function deleteCustomBlock(id: string): Promise<void> {
    return writeBlocks(async blocks => {
        if (!blocks.some(block => block.id === id)) throw new Error('Custom block does not exist');
        return { blocks: blocks.filter(block => block.id !== id), result: undefined };
    });
}

export function copyCustomBlocks(blocks: CustomBlock[], scheduleId: string): Promise<void> {
    if (!blocks.length) return Promise.resolve();
    return writeBlocks(async existing => {
        await requireSchedule(scheduleId);
        // Skips invalid blocks from imported files, and blocks a synced block already shows
        const copies = blocks.flatMap(block => {
            try {
                const copy = customBlockFromDraft(
                    { ...customBlockToDraft(block), syncAcrossAllSchedules: false },
                    scheduleId,
                    generateRandomId()
                );
                return existing.some(other => other.scheduleId === null && isSameBlock(other, copy)) ? [] : [copy];
            } catch {
                return [];
            }
        });
        return { blocks: [...existing, ...copies], result: undefined };
    });
}

export function deleteScheduleCustomBlocks(scheduleId: string): Promise<void> {
    return writeBlocks(async blocks => ({
        blocks: blocks.filter(block => block.scheduleId !== scheduleId),
        result: undefined,
    }));
}

export function deleteAllCustomBlocks(): Promise<void> {
    return writeBlocks(async () => ({ blocks: [], result: undefined }));
}
