import type { Serialized } from '@chrome-extension-toolkit';
import { Course } from '@shared/types/Course';
import type { CustomBlock } from '@shared/types/CustomBlock';
import type { UserSchedule } from '@shared/types/UserSchedule';

import addCourse from './addCourse';
import createSchedule from './createSchedule';
import { copyCustomBlocks } from './customBlocks';
import switchSchedule from './switchSchedule';

function isValidSchedule(data: unknown): data is Serialized<UserSchedule> & { customBlocks?: CustomBlock[] } {
    if (typeof data !== 'object' || data === null) return false;
    const schedule = data as Record<string, unknown>;
    return (
        typeof schedule.id === 'string' &&
        typeof schedule.name === 'string' &&
        Array.isArray(schedule.courses) &&
        (schedule.customBlocks === undefined || Array.isArray(schedule.customBlocks))
    );
}

/**
 * Imports a user schedule from portable file, creating a new schedule for it

 * @param scheduleData - Data to be parsed back into a course schedule
 */
export default async function importSchedule(scheduleData: unknown): Promise<void> {
    if (isValidSchedule(scheduleData)) {
        const newScheduleId = await createSchedule(scheduleData.name);
        await switchSchedule(newScheduleId);

        for (const c of scheduleData.courses) {
            const course = new Course(c);
            await addCourse(newScheduleId, course, true);
        }
        await copyCustomBlocks(scheduleData.customBlocks ?? [], newScheduleId);
        console.log('Course schedule successfully parsed!');
    } else {
        console.error('No schedule data provided for import');
    }
}
