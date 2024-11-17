import { Course } from '@shared/types/Course';

import addCourse from './addCourse';
import createSchedule from './createSchedule';
import switchSchedule from './switchSchedule';

/**
 * Imports a user schedule from portable file, creating a new schedule for it
 
 * @param scheduleData - Data to be parsed back into a course schedule
 */
export default async function importSchedule(scheduleData: string | null) {
    if (scheduleData) {
        const parsedData = JSON.parse(scheduleData);
        console.log('DEREK CHEN WAS HERE', parsedData);
        const newScheduleId = await createSchedule(parsedData.name);
        await switchSchedule(newScheduleId);

        for (const c of parsedData.courses) {
            const course = new Course(c);
            // eslint-disable-next-line no-await-in-loop
            await addCourse(newScheduleId, course);
        }
    } else {
        console.error('No schedule data provided for import');
    }
}
