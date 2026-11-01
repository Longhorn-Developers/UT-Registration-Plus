import { UserScheduleStore } from '@shared/storage/UserScheduleStore';
import type { Course } from '@shared/types/Course';
import { getUnusedColor } from '@shared/util/colors';

/**
 * Adds a course to a user's schedule.
 *
 * @param scheduleId - The id of the schedule to add the course to.
 * @param course - The course to add.
 * @param hasColor - If the course block already has colors manually set
 * @returns A promise that resolves to where the course is in the schedule's courses.
 * @throws An error if the schedule is not found.
 */
export default async function addCourse(scheduleId: string, course: Course, hasColor = false): Promise<number> {
    const schedules = await UserScheduleStore.get('schedules');
    const activeSchedule = schedules.find(s => s.id === scheduleId);
    if (!activeSchedule) {
        throw new Error('Schedule not found');
    }

    if (!hasColor) {
        course.colors = getUnusedColor(activeSchedule, course);
    }

    activeSchedule.courses.push(course);
    activeSchedule.updatedAt = Date.now();
    await UserScheduleStore.set('schedules', schedules);
    console.log(`Course added: ${course.courseName} (ID: ${course.uniqueId})`);
    return activeSchedule.courses.length - 1;
}
