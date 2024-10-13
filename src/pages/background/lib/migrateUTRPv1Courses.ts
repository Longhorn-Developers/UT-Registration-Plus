import { checkLoginStatus } from '@shared/util/checkLoginStatus';
import { getActiveSchedule, switchScheduleByName } from '@views/hooks/useSchedules';
import { courseMigration } from '@views/lib/courseMigration';

import createSchedule from './createSchedule';

/**
 * Retrieves the saved courses from Chrome's synchronized storage and returns an array of course links.
 *
 * @returns A promise that resolves to an array of course links.
 *
 * @remarks
 * - If no courses are found, a message is logged and an empty array is returned.
 * - The function expects the saved courses to be stored under the key 'savedCourses' in Chrome's synchronized storage.
 */
export const getUTRPv1Courses = async (): Promise<string[]> => {
    const { savedCourses } = await chrome.storage.sync.get('savedCourses');
    console.log(savedCourses);

    // Check if the savedCourses array is empty
    if (savedCourses.length === 0) {
        console.log('No courses found');
        prompt('No courses found');
        return [];
    }

    // Extract the link property from each course object and return it as an array
    return savedCourses.map((course: { link: string }) => course.link);
};

/**
 * Handles the migration of UTRP v1 courses.
 *
 * This function checks if the user is logged into the UT course schedule page.
 * If the user is not logged in, it logs a message and exits. If the user is
 * logged in, it retrieves the UTRP v1 courses, creates a new schedule for the
 * migration, switches to the new schedule, and migrates the courses to the
 * active schedule.
 *
 * @returns A promise that resolves when the migration is complete.
 */
const migrateUTRPv1Courses = async () => {
    const loggedInToUT = await checkLoginStatus('https://utdirect.utexas.edu/apps/registrar/course_schedule/20252/');

    if (!loggedInToUT) {
        console.log('Not logged in to UT');

        // Return for now, retry functionality will be added later
        return;
    }

    const courses: string[] = await getUTRPv1Courses();
    console.log(courses);

    await createSchedule('UTRP v1 Migration');
    console.log('Created UTRP v1 migration schedule');
    await switchScheduleByName('UTRP v1 Migration');

    courseMigration(getActiveSchedule(), courses);
    console.log('Successfully migrated UTRP v1 courses');
};

export default migrateUTRPv1Courses;
