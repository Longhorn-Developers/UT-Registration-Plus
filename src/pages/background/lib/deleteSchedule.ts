import { UserScheduleStore } from '@shared/storage/UserScheduleStore';

import createSchedule from './createSchedule';

/**
 * Deletes a schedule with the specified name.
 *
 * @param scheduleId - The id of the schedule to delete.
 * @returns A promise that resolves to a string if there is an error, or undefined if the schedule is deleted successfully.
 */
export default async function deleteSchedule(scheduleId: string): Promise<string | undefined> {
    const [schedules, activeIndex] = await Promise.all([
        UserScheduleStore.get('schedules'),
        UserScheduleStore.get('activeIndex'),
    ]);

    const scheduleIndex = schedules.findIndex(schedule => schedule.id === scheduleId);
    if (scheduleIndex === -1) {
        throw new Error(`Schedule ${scheduleId} does not exist`);
    }

    // replaced the in-place splice function
    const nextSchedules = schedules.filter((_, index) => index !== scheduleIndex);
    await UserScheduleStore.set('schedules', nextSchedules);

    // By invariant, there must always be at least one schedule
    // hah. algos - derek
    if (nextSchedules.length === 0) {
        createSchedule('Schedule 1');
    }

    let newActiveIndex = activeIndex;
    if (scheduleIndex < activeIndex) {
        newActiveIndex = activeIndex - 1;
    } else if (activeIndex >= nextSchedules.length) {
        newActiveIndex = nextSchedules.length - 1;
    }
    await UserScheduleStore.set('activeIndex', newActiveIndex);

    return undefined;
}

/**
 * Deletes all schedules.
 *
 * @returns A promise that resolves when all schedules are deleted
 */
export async function deleteAllSchedules(): Promise<void> {
    await UserScheduleStore.set('schedules', []);
    await UserScheduleStore.set('activeIndex', 0);
    await createSchedule('Schedule 1');
}
