import { UserScheduleStore } from '@shared/storage/UserScheduleStore';

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
    if (scheduleIndex === activeIndex) {
        throw new Error('You cannot delete your active schedule! Please switch to another schedule before deleting.');
    }

    schedules.splice(scheduleIndex, 1);
    await UserScheduleStore.set('schedules', schedules);

    if (activeIndex >= schedules.length) {
        await UserScheduleStore.set('activeIndex', schedules.length - 1);
    }
    return undefined;
}
