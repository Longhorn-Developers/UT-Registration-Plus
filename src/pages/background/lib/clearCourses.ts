import { UserScheduleStore } from '@src/shared/storage/UserScheduleStore';

export default async function clearCourses(scheduleName: string): Promise<void> {
    const schedules = await UserScheduleStore.get('schedules');
    const schedule = schedules.find(schedule => schedule.name === scheduleName);
    if (!schedule) {
        throw new Error(`Schedule ${scheduleName} does not exist`);
    }
    schedule.courses = [];
    await UserScheduleStore.set('schedules', schedules);
}
