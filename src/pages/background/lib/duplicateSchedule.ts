import { CustomBlockStore } from '@shared/storage/CustomBlockStore';
import { UserScheduleStore } from '@shared/storage/UserScheduleStore';
import { generateRandomId } from '@shared/util/random';
import { copyCustomBlocks } from './customBlocks';
import handleDuplicate from './handleDuplicate';

/**
 * Creates a new schedule with the given name
 *
 * @param scheduleName - The name of the schedule to create
 * @returns Undefined if successful, otherwise an error message
 */
export default async function duplicateSchedule(scheduleId: string): Promise<string | undefined> {
    const schedules = await UserScheduleStore.get('schedules');
    const scheduleIndex = schedules.findIndex(schedule => schedule.id === scheduleId);

    if (scheduleIndex === -1) {
        throw new Error(`Schedule ${scheduleId} does not exist`);
    }

    // biome-ignore lint/style/noNonNullAssertion: We've already checked for edge cases
    const schedule = schedules[scheduleIndex]!;

    const copyOfName = `Copy of ${schedule.name}`;
    const updatedName = await handleDuplicate(copyOfName);
    const copyId = generateRandomId();

    schedules.splice(scheduleIndex + 1, 0, {
        id: copyId,
        name: updatedName,
        courses: JSON.parse(JSON.stringify(schedule.courses)),
        hours: schedule.hours,
        updatedAt: Date.now(),
    } satisfies typeof schedule);

    await UserScheduleStore.set('schedules', schedules);
    const blocks = await CustomBlockStore.get('blocks');
    await copyCustomBlocks(
        blocks.filter(block => block.scheduleId === scheduleId),
        copyId
    );

    // Automatically switch to the duplicated schedule
    await UserScheduleStore.set('activeIndex', scheduleIndex + 1);

    return undefined;
}
