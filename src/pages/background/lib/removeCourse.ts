import { UserScheduleStore } from '@shared/storage/UserScheduleStore';
import type { Course } from '@shared/types/Course';

/**
 * Removes a course from a user's schedule.
 * @param scheduleName - The name of the schedule.
 * @param course - The course to be removed.
 * @returns A promise that resolves when the course is successfully removed.
 * @throws An error if the schedule is not found.
 */
export default async function removeCourse(scheduleName: string, course: Course): Promise<void> {
    const schedules = await UserScheduleStore.get('schedules');
    const activeSchedule = schedules.find(s => s.name === scheduleName);
    if (!activeSchedule) {
        throw new Error('Schedule not found');
    }

    activeSchedule.courses = activeSchedule.courses.filter(c => c.uniqueId !== course.uniqueId);

    await UserScheduleStore.set('schedules', schedules);
}
