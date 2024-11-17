import { getActiveSchedule } from '@views/hooks/useSchedules';

import { addCourseByURL } from './addCourseByURL';
import createSchedule from './createSchedule';
import switchSchedule from './switchSchedule';

/**
 * Imports a user schedule from portable file, creating a new schedule for it
 * @param scheduleData - Data to be parsed back into a course schedule
 */
export default async function importSchedule(scheduleData: string | null) {
    if (scheduleData) {
        const parsedData = JSON.parse(scheduleData);
        const newScheduleId = await createSchedule(parsedData.name);
        await switchSchedule(newScheduleId);
        const activeSchedule = getActiveSchedule();

        for (const course of parsedData.courses) {
            if (course.url) {
                // eslint-disable-next-line no-await-in-loop
                await addCourseByURL(activeSchedule, course.url);
            }
        }
    } else {
        console.error('No schedule data provided for import');
    }
}
