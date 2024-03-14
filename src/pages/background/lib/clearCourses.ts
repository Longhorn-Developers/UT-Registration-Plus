import { UserScheduleStore } from '@shared/storage/UserScheduleStore';

/**
 * Clears the courses for a given schedule.
 * @param scheduleId - The id of the schedule.
 * @throws Error if the schedule does not exist.
 */
export default async function clearCourses(scheduleId: string): Promise<void> {
    const schedules = await UserScheduleStore.get('schedules');
    const schedule = schedules.find(schedule => schedule.id === scheduleId);
    if (!schedule) {
        throw new Error(`Schedule ${scheduleId} does not exist`);
    }
    schedule.courses = [];
    schedule.updatedAt = Date.now();

    await UserScheduleStore.set('schedules', schedules);
}
