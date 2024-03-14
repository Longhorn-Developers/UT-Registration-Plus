import { UserScheduleStore } from '@shared/storage/UserScheduleStore';

/**
 * Clears the courses for a given schedule.
 * @param scheduleName - The name of the schedule.
 * @throws Error if the schedule does not exist.
 */
export default async function clearCourses(scheduleName: string): Promise<void> {
    const schedules = await UserScheduleStore.get('schedules');
    const schedule = schedules.find(schedule => schedule.name === scheduleName);
    if (!schedule) {
        throw new Error(`Schedule ${scheduleName} does not exist`);
    }
    schedule.courses = [];
    schedule.updatedAt = Date.now();

    await UserScheduleStore.set('schedules', schedules);
}
