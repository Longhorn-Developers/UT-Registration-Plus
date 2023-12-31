import { UserScheduleStore } from '@src/shared/storage/UserScheduleStore';
import { Course } from '@src/shared/types/Course';

/**
 *
 */
export default async function addCourse(scheduleName: string, course: Course): Promise<void> {
    const schedules = await UserScheduleStore.get('schedules');
    const activeSchedule = schedules.find(s => s.name === scheduleName);
    if (!activeSchedule) {
        throw new Error('Schedule not found');
    }

    activeSchedule.courses.push(course);

    await UserScheduleStore.set('schedules', schedules);
}
