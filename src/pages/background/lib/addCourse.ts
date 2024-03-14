import { UserScheduleStore } from '@shared/storage/UserScheduleStore';
import type { Course } from '@shared/types/Course';

/**
 * Adds a course to a user's schedule.
 * @param scheduleName - The name of the schedule to add the course to.
 * @param course - The course to add.
 * @returns A promise that resolves to void.
 * @throws An error if the schedule is not found.
 */
export default async function addCourse(scheduleName: string, course: Course): Promise<void> {
    const schedules = await UserScheduleStore.get('schedules');
    const activeSchedule = schedules.find(s => s.name === scheduleName);
    if (!activeSchedule) {
        throw new Error('Schedule not found');
    }

    activeSchedule.courses.push(course);
    activeSchedule.updatedAt = Date.now();

    await UserScheduleStore.set('schedules', schedules);
}
