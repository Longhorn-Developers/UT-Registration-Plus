import { UserScheduleStore } from '@shared/storage/UserScheduleStore';

/**
 * Renames a schedule with the specified name to a new name.
 * @param scheduleName - The name of the schedule to be renamed.
 * @param newName - The new name for the schedule.
 * @returns A promise that resolves to a string if there is an error, or undefined if the schedule is renamed successfully.
 */
export default async function renameSchedule(scheduleName: string, newName: string): Promise<string | undefined> {
    const schedules = await UserScheduleStore.get('schedules');
    const scheduleIndex = schedules.findIndex(schedule => schedule.name === scheduleName);
    if (scheduleIndex === -1) {
        return `Schedule ${scheduleName} does not exist`;
    }
    if (schedules.find(schedule => schedule.name === newName)) {
        return `Schedule ${newName} already exists`;
    }

    schedules[scheduleIndex].name = newName;
    schedules[scheduleIndex].updatedAt = Date.now();

    await UserScheduleStore.set('schedules', schedules);
    return undefined;
}
