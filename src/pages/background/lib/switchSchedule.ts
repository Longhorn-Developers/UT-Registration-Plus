import { UserScheduleStore } from '@shared/storage/UserScheduleStore';

/**
 * Switches the active schedule to the specified schedule name.
 * Throws an error if the schedule does not exist.
 * @param scheduleId - The id of the schedule to switch to.
 * @returns A Promise that resolves when the active schedule is successfully switched.
 */
export default async function switchSchedule(scheduleId: string): Promise<void> {
    const schedules = await UserScheduleStore.get('schedules');

    const scheduleIndex = schedules.findIndex(schedule => schedule.id === scheduleId);
    if (scheduleIndex === -1) {
        throw new Error(`Schedule ${scheduleId} does not exist`);
    }

    schedules[scheduleIndex]!.updatedAt = Date.now();

    await UserScheduleStore.set('activeIndex', scheduleIndex);
}
