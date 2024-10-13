import addCourse from '@pages/background/lib/addCourse';
import type { UserSchedule } from '@shared/types/UserSchedule';
import { CourseCatalogScraper } from '@views/lib/CourseCatalogScraper';
import getCourseTableRows from '@views/lib/getCourseTableRows';
import { SiteSupport } from '@views/lib/getSiteSupport';

/**
 * Migrates courses from UTRP v1 to a new schedule.
 *
 * @param activeSchedule - The active schedule to migrate the courses to.
 * @param links - An array of UTRP v1 course URLs.
 * @returns A promise that resolves when the migration is complete.
 *
 * This hook performs the following steps:
 * 1. Fetches the course details from the links.
 * 2. Scrapes the course information from the fetched HTML.
 * 3. Checks if the course was found and adds it to the active schedule if it doesn't already exist.
 *
 * Notes:
 * - Chrome warns in the console that in the future, cookies will not work when we do a network request like how we are doing it now, so might need to open a new tab instead.
 */
export const courseMigration = async (activeSchedule: UserSchedule, links: string[]): Promise<void> => {
    // Loop over the links
    for (const link of links) {
        // eslint-disable-next-line no-await-in-loop
        const response = await fetch(link);
        // eslint-disable-next-line no-await-in-loop
        const text = await response.text();
        const doc = new DOMParser().parseFromString(text, 'text/html');

        // Scrape the course
        const scraper = new CourseCatalogScraper(SiteSupport.COURSE_CATALOG_DETAILS, doc, link);
        const tableRows = getCourseTableRows(doc);
        const courses = scraper.scrape(tableRows, false);

        // Check if the course was found
        if (courses.length === 1) {
            const description = scraper.getDescription(doc);
            const row = courses[0]!;
            const course = row.course!;
            course.description = description;

            // Add the course if it doesn't already exist
            if (activeSchedule.courses.every(c => c.uniqueId !== course.uniqueId)) {
                console.log(`Adding course: ${course} to schedule: ${activeSchedule.name}`);
                addCourse(activeSchedule.id, course);
            }
        } else {
            console.log(courses);
        }
    }
};
