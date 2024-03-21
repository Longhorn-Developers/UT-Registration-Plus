import { UserScheduleStore } from '@shared/storage/UserScheduleStore';

import handleDuplicate from './handleDuplicate';

/**
 * Renames a schedule with the specified name to a new name.
 * @param scheduleId - The id of the schedule to be renamed.
 * @param newName - The new name for the schedule.
 * @returns A promise that resolves to a string if there is an error, or undefined if the schedule is renamed successfully.
 */
export default async function renameSchedule(scheduleId: string, newName: string): Promise<string | undefined> {
    const schedules = await UserScheduleStore.get('schedules');
    const scheduleIndex = schedules.findIndex(schedule => schedule.id === scheduleId);
    if (scheduleIndex === -1) {
        return `Schedule ${scheduleId} does not exist`;
    }


    const updatedName = await handleDuplicate(newName);

    schedules[scheduleIndex].name = updatedName;
    schedules[scheduleIndex].updatedAt = Date.now();

    await UserScheduleStore.set('schedules', schedules);
    return undefined;
}
