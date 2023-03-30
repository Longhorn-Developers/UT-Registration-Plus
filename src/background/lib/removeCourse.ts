import { userScheduleStore } from 'src/shared/storage/UserScheduleStore';
import { Course } from 'src/shared/types/Course';

/**
 *
 */
export default async function removeCourse(scheduleId: string, course: Course): Promise<void> {
    const schedules = await userScheduleStore.get('schedules');
    const activeSchedule = schedules.find(s => s.id === scheduleId);
    if (!activeSchedule) {
        throw new Error('Schedule not found');
    }

    activeSchedule.creditHours -= course.creditHours;
    activeSchedule.courses = activeSchedule.courses.filter(c => c.uniqueId !== course.uniqueId);

    await userScheduleStore.set('schedules', schedules);
}
