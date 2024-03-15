import { UserScheduleStore } from '@shared/storage/UserScheduleStore';
import type { Course } from '@shared/types/Course';

/**
 *
 */
export default async function removeCourse(scheduleId: string, course: Course): Promise<void> {
    const schedules = await UserScheduleStore.get('schedules');
    const activeSchedule = schedules.find(s => s.id === scheduleId);
    if (!activeSchedule) {
        throw new Error('Schedule not found');
    }

    activeSchedule.courses = activeSchedule.courses.filter(c => c.uniqueId !== course.uniqueId);
    activeSchedule.updatedAt = Date.now();

    await UserScheduleStore.set('schedules', schedules);
}
