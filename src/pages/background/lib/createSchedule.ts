import { UserScheduleStore } from '@shared/storage/UserScheduleStore';
import { generateRandomId } from '@shared/util/random';

import handleDuplicate from './handleDuplicate';

/**
 * Creates a new schedule with the given name
 * @param scheduleName the name of the schedule to create
 * @returns undefined if successful, otherwise an error message
 */
export default async function createSchedule(scheduleName: string): Promise<string | undefined> {
    const schedules = await UserScheduleStore.get('schedules');
    // Duplicate schedule found, we need to append a number to the end of the schedule name

    // eslint-disable-next-line no-param-reassign
    scheduleName = await handleDuplicate(scheduleName);

    schedules.push({
        id: generateRandomId(),
        name: scheduleName,
        courses: [],
        hours: 0,
        updatedAt: Date.now(),
    });

    await UserScheduleStore.set('schedules', schedules);
    return undefined;
}
