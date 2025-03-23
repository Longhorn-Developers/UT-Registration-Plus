import { validateLoginStatus } from '@shared/util/checkLoginStatus';
import { getActiveSchedule } from '@views/hooks/useSchedules';
import { courseMigration } from '@views/lib/courseMigration';

import addCourse from './addCourse';
import createSchedule from './createSchedule';
import switchSchedule from './switchSchedule';

/**
 * Retrieves the saved courses from the extension's chrome sync storage (old store) and returns an array of course links.
 *
 * @returns A promise that resolves to an array of course links.
 */
export async function getUTRPv1Courses(): Promise<string[]> {
    const { savedCourses } = await chrome.storage.sync.get('savedCourses');

    // Check if the savedCourses array is empty
    if (!savedCourses || savedCourses.length === 0) {
        return [];
    }

    // Extract the link property from each course object and return it as an array
    return savedCourses.map((course: { link: string }) => course.link);
}

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
async function migrateUTRPv1Courses() {
    const loggedInToUT = await validateLoginStatus(
        'https://utdirect.utexas.edu/apps/registrar/course_schedule/utrp_login/'
    );

    if (!loggedInToUT) {
        console.warn('Not logged in to UT Registrar.');
        return false;
    }

    const oldCourses = await getUTRPv1Courses();
    console.log(oldCourses);

    const migratedCourses = await courseMigration(oldCourses);

    if (migratedCourses.length > 0) {
        console.log(oldCourses, migratedCourses);
        const migrateSchedule = await createSchedule('Migrated Schedule');
        await switchSchedule(migrateSchedule);

        const activeSchedule = getActiveSchedule();

        for (const course of migratedCourses) {
            // Add the course if it doesn't already exist
            if (activeSchedule.courses.every(c => c.uniqueId !== course.uniqueId)) {
                // ignore eslint, as we *do* want to spend time on each iteration
                // eslint-disable-next-line no-await-in-loop
                await addCourse(activeSchedule.id, course);
            }
        }

        // Remove the old courses from storage :>
        await chrome.storage.sync.remove('savedCourses');
        console.log('Successfully migrated UTRP v1 courses');
    } else {
        console.warn('No courses successfully found to migrate');
    }

    return true;
}

export default migrateUTRPv1Courses;
