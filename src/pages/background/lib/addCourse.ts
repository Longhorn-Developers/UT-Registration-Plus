import { UserScheduleStore } from '@shared/storage/UserScheduleStore';
import type { Course } from '@shared/types/Course';
import { getUnusedColor } from '@shared/util/colors';

/**
 * Adds a course to a user's schedule.
 * @param scheduleId - The id of the schedule to add the course to.
 * @param course - The course to add.
 * @returns A promise that resolves to void.
 * @throws An error if the schedule is not found.
 */
export default async function addCourse(scheduleId: string, course: Course): Promise<void> {
    const schedules = await UserScheduleStore.get('schedules');
    const activeSchedule = schedules.find(s => s.id === scheduleId);
    if (!activeSchedule) {
        throw new Error('Schedule not found');
    }

    course.colors = getUnusedColor(activeSchedule, course);
    activeSchedule.courses.push(course);
    activeSchedule.updatedAt = Date.now();

    await UserScheduleStore.set('schedules', schedules);
}
