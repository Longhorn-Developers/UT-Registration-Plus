import { UserScheduleStore } from '@shared/storage/UserScheduleStore';

export default async function switchSchedule(scheduleName: string): Promise<void> {
    const schedules = await UserScheduleStore.get('schedules');

    const scheduleIndex = schedules.findIndex(schedule => schedule.name === scheduleName);
    if (scheduleIndex === -1) {
        throw new Error(`Schedule ${scheduleName} does not exist`);
    }

    await UserScheduleStore.set('activeIndex', scheduleIndex);
}
