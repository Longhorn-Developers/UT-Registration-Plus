import { UserScheduleStore } from '@shared/storage/UserScheduleStore';
import type { UserSchedule } from '@shared/types/UserSchedule';
import { generateRandomId } from '@shared/util/random';
import type { Serialized } from 'chrome-extension-toolkit';

/**
 * Creates a new schedule with the given name
 * @param scheduleName the name of the schedule to create
 * @returns undefined if successful, otherwise an error message
 */
export default async function createSchedule(scheduleName: string) {
    const schedules = await UserScheduleStore.get('schedules');
    // get the number of schedules that either have the same name or have the same name with a number appended (e.g. "New Schedule (1)")
    // this way we can prevent duplicate schedule names and increment the number if necessary

    // Regex to match schedule names that follow the pattern "ScheduleName" or "ScheduleName (1)", "ScheduleName (2)", etc.
    const regex = new RegExp(`^${scheduleName}( \\(\\d+\\))?$`);

    // Find how many schedules match the base name or follow the pattern with a number
    const count = schedules.filter(s => regex.test(s.name)).length;

    // If any matches are found, append the next number to the schedule name
    let name = scheduleName;
    if (count > 0) {
        name = `${scheduleName} (${count})`;
    }

    const newSchedule: Serialized<UserSchedule> = {
        id: generateRandomId(),
        name,
        courses: [],
        hours: 0,
        updatedAt: Date.now(),
    };
    schedules.push(newSchedule);

    await UserScheduleStore.set('schedules', schedules);
    return newSchedule.id;
}
