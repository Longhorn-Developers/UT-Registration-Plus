import { UserScheduleStore } from '@shared/storage/UserScheduleStore';
import { generateRandomId } from '@shared/util/random';

import handleDuplicate from './handleDuplicate';

/**
 * Creates a new schedule with the given name
 * @param scheduleName the name of the schedule to create
 * @returns undefined if successful, otherwise an error message
 */
export default async function duplicateSchedule(scheduleName: string): Promise<string | undefined> {
    const schedules = await UserScheduleStore.get('schedules');
    const schedule = schedules.find(schedule => schedule.name === scheduleName);

    if (schedule === undefined) {
        return `Schedule ${scheduleName} does not exist`;
    }

    const updatedName = await handleDuplicate(scheduleName);

    schedules.push({
        id: generateRandomId(),
        name: updatedName,
        courses: JSON.parse(JSON.stringify(schedule.courses)),
        hours: schedule.hours,
        updatedAt: Date.now(),
    });

    await UserScheduleStore.set('schedules', schedules);
    return undefined;
}
