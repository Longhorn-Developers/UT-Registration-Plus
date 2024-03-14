import { UserScheduleStore } from '@shared/storage/UserScheduleStore';

/**
 * Creates a new schedule with the given name
 * @param scheduleName the name of the schedule to create
 * @returns undefined if successful, otherwise an error message
 */
export default async function createSchedule(scheduleName: string): Promise<string | undefined> {
    const schedules = await UserScheduleStore.get('schedules');
    if (schedules.find(schedule => schedule.name === scheduleName)) {
        return `Schedule ${scheduleName} already exists`;
    }

    schedules.push({
        name: scheduleName,
        courses: [],
        hours: 0,
        updatedAt: Date.now(),
        id: '',
    });

    await UserScheduleStore.set('schedules', schedules);
    return undefined;
}
