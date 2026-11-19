import type { Serialized } from '@chrome-extension-toolkit';
import { UserScheduleStore } from '@shared/storage/UserScheduleStore';
import type { Course } from '@shared/types/Course';

/**
 * Removes a course from a user's schedule.
 *
 * @param scheduleId - The id of the schedule to remove the course from.
 * @param course - The course to remove.
 * @returns The course as it was in the schedule (with its colors) and where it was, or undefined if it wasn't there.
 * @throws An error if the schedule is not found.
 */
export default async function removeCourse(
    scheduleId: string,
    course: Course
): Promise<{ course: Serialized<Course>; index: number } | undefined> {
    const schedules = await UserScheduleStore.get('schedules');
    const activeSchedule = schedules.find(s => s.id === scheduleId);
    if (!activeSchedule) {
        throw new Error('Schedule not found');
    }

    const index = activeSchedule.courses.findIndex(c => c.uniqueId === course.uniqueId);
    const removed = activeSchedule.courses[index];
    activeSchedule.courses = activeSchedule.courses.filter(c => c.uniqueId !== course.uniqueId);
    activeSchedule.updatedAt = Date.now();

    await UserScheduleStore.set('schedules', schedules);
    return removed && { course: removed, index };
}
