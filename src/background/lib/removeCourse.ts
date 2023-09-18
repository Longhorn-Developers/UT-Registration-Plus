import { UserScheduleStore } from 'src/shared/storage/UserScheduleStore';
import { Course } from 'src/shared/types/Course';

/**
 *
 */
export default async function removeCourse(scheduleName: string, course: Course): Promise<void> {
    const schedules = await UserScheduleStore.get('schedules');
    const activeSchedule = schedules.find(s => s.name === scheduleName);
    if (!activeSchedule) {
        throw new Error('Schedule not found');
    }

    activeSchedule.creditHours -= course.creditHours;
    activeSchedule.courses = activeSchedule.courses.filter(c => c.uniqueId !== course.uniqueId);

    await UserScheduleStore.set('schedules', schedules);
}
