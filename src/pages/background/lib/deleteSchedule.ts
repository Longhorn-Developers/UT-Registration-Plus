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
        return `Schedule ${scheduleId} does not exist`;
    }
    if (scheduleIndex === activeIndex) {
        return 'Cannot delete active schedule';
    }

    schedules.splice(scheduleIndex, 1);
    await UserScheduleStore.set('schedules', schedules);
    return undefined;
}
