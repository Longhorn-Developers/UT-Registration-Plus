import { UserScheduleStore } from '@shared/storage/UserScheduleStore';

/**
 * Duplicates a new schedule with the given name.
 * Assumes that each schedule has a unique name.
 * @param scheduleName the name of the schedule to handle duplication for
 * @param schedules the list of UserSchedules to find existing names
 * @returns the new name for the schedule, of the form `{baseName}({index})`
 */
export default async function handleDuplicate(scheduleName: string): Promise<string> {
    const schedules = await UserScheduleStore.get('schedules');

    // No point in checking for duplicates if the name is unique
    if (schedules.find(schedule => schedule.name === scheduleName) === undefined) {
        return scheduleName;
    }

    // Regex for matching `{baseName}({index})`, where match[1] = baseName, match[2] = (index)
    const regex = /^(.+?)(\(\d+\))?$/;

    // Extract base name and existing index
    const match = scheduleName.match(regex);
    const baseName = match && match[1] ? match[1] : scheduleName;

    // Extract number from parentheses and increment
    let index = match && match[2] ? parseInt(match[2].slice(1, -1), 10) + 1 : 1;

    let newName = `${baseName}(${index})`;

    // Increment until an unused index is found
    // eslint-disable-next-line @typescript-eslint/no-loop-func
    while (schedules.find(schedule => schedule.name === newName)) {
        newName = `${baseName}(${++index})`;
    }

    return newName;
}
