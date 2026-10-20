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
}

export function createCustomBlock(draft: CustomBlockDraft, scheduleId: string): Promise<CustomBlock> {
    return writeBlocks(async blocks => {
        await requireSchedule(scheduleId);
        const block = customBlockFromDraft(draft, scheduleId, generateRandomId());
        return { blocks: [...blocks, block], result: block };
    });
}

export function updateCustomBlock(id: string, draft: CustomBlockDraft, scheduleId: string): Promise<CustomBlock> {
    return writeBlocks(async blocks => {
        await requireSchedule(scheduleId);
        if (!blocks.some(block => block.id === id)) throw new Error('Custom block does not exist');
        const updated = customBlockFromDraft(draft, scheduleId, id);
        return { blocks: blocks.map(block => (block.id === id ? updated : block)), result: updated };
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
        const copies = blocks.map(block =>
            customBlockFromDraft(
                { ...customBlockToDraft(block), syncAcrossAllSchedules: false },
                scheduleId,
                generateRandomId()
            )
        );
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
