import { UserScheduleStore } from '@shared/storage/UserScheduleStore';
import { generateRandomId } from '@shared/util/random';

import handleDuplicate from './handleDuplicate';

/**
 * Creates a new schedule with the given name
 * @param scheduleName the name of the schedule to create
 * @returns undefined if successful, otherwise an error message
 */
export default async function duplicateSchedule(scheduleId: string): Promise<string | undefined> {
    const schedules = await UserScheduleStore.get('schedules');
    const scheduleIndex = schedules.findIndex(schedule => schedule.id === scheduleId);

    if (scheduleIndex === -1) {
        throw new Error(`Schedule ${scheduleId} does not exist`);
    }

    const schedule = schedules[scheduleIndex]!;

    const copyOfName = `Copy of ${schedule.name}`;
    const updatedName = await handleDuplicate(copyOfName);

    schedules.splice(scheduleIndex + 1, 0, {
        id: generateRandomId(),
        name: updatedName,
        courses: JSON.parse(JSON.stringify(schedule.courses)),
        hours: schedule.hours,
        updatedAt: Date.now(),
    } satisfies typeof schedule);

    await UserScheduleStore.set('schedules', schedules);
    return undefined;
}
