import addCourse from '@pages/background/lib/addCourse';
import { getCourseByURL } from '@pages/background/lib/getCourseByURL';
import type { UserSchedule } from '@shared/types/UserSchedule';

/**
 * Adds a course to the active schedule by fetching course details from a provided URL.
 * If no URL is provided, prompts the user to enter one.
 * Sriram and Elie made this
 *
 * @param activeSchedule - The user's active schedule to which the course will be added.
 * @param link - The URL from which to fetch the course details. If not provided, a prompt will ask for it.
 *
 * @returns A promise that resolves when the course has been added or the operation is cancelled.
 *
 * @throws an error if there is an issue with scraping the course details.
 */
export async function addCourseByURL(activeSchedule: UserSchedule, link?: string): Promise<void> {
    // todo: Use a proper modal instead of a prompt
    // eslint-disable-next-line no-param-reassign, no-alert
    if (!link) link = prompt('Enter course link') || undefined;

    // Exit if the user cancels the prompt
    if (!link) {
        return;
    }

    try {
        const course = await getCourseByURL(link);
        if (!course) return;
        if (activeSchedule.courses.some(c => c.uniqueId === course.uniqueId)) {
            console.log('Course already exists');
            return;
        }

        console.log('Adding course');
        await addCourse(activeSchedule.id, course);
    } catch (error) {
        // eslint-disable-next-line no-alert
        alert(`Failed to fetch url '${link}'`);
        console.error('Error scraping course:', error);
        
    }
}
