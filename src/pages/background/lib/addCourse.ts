import { UserScheduleStore } from '@shared/storage/UserScheduleStore';
import type { Course } from '@shared/types/Course';

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
