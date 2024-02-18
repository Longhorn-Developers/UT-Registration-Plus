import { UserScheduleStore } from '@shared/storage/UserScheduleStore';

/**
 * Switches the active schedule to the specified schedule name.
 * Throws an error if the schedule does not exist.
 * @param scheduleName - The name of the schedule to switch to.
 * @returns A promise that resolves when the active schedule is successfully switched.
 */
export default async function switchSchedule(scheduleName: string): Promise<void> {
    const schedules = await UserScheduleStore.get('schedules');

    const scheduleIndex = schedules.findIndex(schedule => schedule.name === scheduleName);
    if (scheduleIndex === -1) {
        throw new Error(`Schedule ${scheduleName} does not exist`);
    }

    await UserScheduleStore.set('activeIndex', scheduleIndex);
}
