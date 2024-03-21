import { UserScheduleStore } from '@shared/storage/UserScheduleStore';

/**
 * Duplicates a new schedule with the given name.
 * Assumes that each schedule has a unique name.
 * @param scheduleName the name of the schedule to handle duplication for
 * @param schedules the list of UserSchedules to find existing names
 * @returns the new name for the schedule, of the form "scheduleName (int)"
 */
export default async function handleDuplicate(scheduleName: string): Promise<string> {
    const schedules = await UserScheduleStore.get('schedules');

    // No point in checking for duplicates if the name is unique
    if (schedules.find(schedule => schedule.name === scheduleName) === undefined) {
        return scheduleName;
    }

    // Regex matches strings of the form: " (int)"
    const regex = / \((\d+)\)[^(]*$/;
    let index = 1;

    // Trim ending number
    let baseName = scheduleName.replace(regex, '');
    let newName = `${baseName}`;

    // Increment until an unused index is found
    // eslint-disable-next-line @typescript-eslint/no-loop-func
    while (schedules.find(schedule => schedule.name === newName)) {
        newName = `${baseName} (${++index})`;
    }

    return newName;
}
