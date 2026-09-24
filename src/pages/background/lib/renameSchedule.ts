import { UserScheduleStore } from '@shared/storage/UserScheduleStore';

import handleDuplicate from './handleDuplicate';

/**
 * Renames a schedule with the specified name to a new name.
 * @param scheduleId - The id of the schedule to be renamed.
 * @param newName - The new name for the schedule.
 * @returns A promise that resolves to the new name if successful, otherwise undefined.
 */
export default async function renameSchedule(scheduleId: string, newName: string): Promise<string | undefined> {
    const schedules = await UserScheduleStore.get('schedules');

    const scheduleIndex = schedules.findIndex(schedule => schedule.id === scheduleId);
    if (scheduleIndex === -1) {
        return undefined;
    }
    const schedule = schedules[scheduleIndex];
    if (schedule === undefined) {
        return undefined;
    }

    // if old name is of the form `{baseName}{index}` and newName === baseName, do nothing.
    const oldName = schedule.name;
    const regex = /^(.+?)(\(\d+\))?$/;
    const match = oldName?.match(regex);
    const baseName = match?.[1] ?? '';
    const baseNameOfNewName = newName.match(regex)?.[1];

    if (baseName === baseNameOfNewName) {
        return oldName;
    }

    const updatedName = await handleDuplicate(newName);

    // object was being altered directly, now we iterate through and make a new schedule, modifying the specific one we wanted to rename
    const updatedSchedules = schedules.map((currentSchedule, index) =>
        index === scheduleIndex
            ? ({
                  ...currentSchedule,
                  name: updatedName,
                  updatedAt: Date.now(),
              } satisfies (typeof schedules)[number])
            : currentSchedule
    );

    await UserScheduleStore.set('schedules', updatedSchedules);
    return updatedName;
}
