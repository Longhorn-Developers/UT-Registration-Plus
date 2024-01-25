import { UserScheduleStore } from '@shared/storage/UserScheduleStore';

export default async function renameSchedule(scheduleName: string, newName: string): Promise<string | undefined> {
    const schedules = await UserScheduleStore.get('schedules');
    const scheduleIndex = schedules.findIndex(schedule => schedule.name === scheduleName);
    if (scheduleIndex === -1) {
        return `Schedule ${scheduleName} does not exist`;
    }
    if (schedules.find(schedule => schedule.name === newName)) {
        return `Schedule ${newName} already exists`;
    }

    schedules[scheduleIndex].name = newName;

    await UserScheduleStore.set('schedules', schedules);
    return undefined;
}
