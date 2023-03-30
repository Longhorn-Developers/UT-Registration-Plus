import { userScheduleStore } from 'src/shared/storage/UserScheduleStore';
import { Course } from 'src/shared/types/Course';

/**
 *
 */
export default async function addCourse(scheduleId: string, course: Course): Promise<void> {
    const schedules = await userScheduleStore.get('schedules');
    const activeSchedule = schedules.find(s => s.id === scheduleId);
    if (!activeSchedule) {
        throw new Error('Schedule not found');
    }

    activeSchedule.creditHours += course.creditHours;
    activeSchedule.courses.push(course);

    await userScheduleStore.set('schedules', schedules);
}
