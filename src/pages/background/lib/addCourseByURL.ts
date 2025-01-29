import addCourse from '@pages/background/lib/addCourse';
import { background } from '@shared/messages';
import type { UserSchedule } from '@shared/types/UserSchedule';
import { CourseCatalogScraper } from '@views/lib/CourseCatalogScraper';
import getCourseTableRows from '@views/lib/getCourseTableRows';
import { SiteSupport } from '@views/lib/getSiteSupport';

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
        let htmlText: string;
        try {
            htmlText = await background.addCourseByURL({
                url: link,
                method: 'GET',
                response: 'text',
            });
        } catch (e) {
            // eslint-disable-next-line no-alert
            alert(`Failed to fetch url '${link}'`);
            return;
        }

        const doc = new DOMParser().parseFromString(htmlText, 'text/html');

        const scraper = new CourseCatalogScraper(SiteSupport.COURSE_CATALOG_DETAILS, doc, link);
        const tableRows = getCourseTableRows(doc);
        const scrapedCourses = scraper.scrape(tableRows, false);

        if (scrapedCourses.length !== 1) return;
        const description = scraper.getDescription(doc);
        const row = scrapedCourses[0]!;
        const course = row.course!;
        course.description = description;

        if (activeSchedule.courses.every(c => c.uniqueId !== course.uniqueId)) {
            console.log('Adding course');
            await addCourse(activeSchedule.id, course);
        } else {
            console.log('Course already exists');
        }
    } catch (error) {
        console.error('Error scraping course:', error);
    }
}
