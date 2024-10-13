import addCourse from '@pages/background/lib/addCourse';
import { CourseCatalogScraper } from '@views/lib/CourseCatalogScraper';
import getCourseTableRows from '@views/lib/getCourseTableRows';
import { SiteSupport } from '@views/lib/getSiteSupport';

import { useFlattenedCourseSchedule } from './useFlattenedCourseSchedule';

const SEMESTER_CODE = '20239';

/**
 * Migrates courses from UTRP v1 to the active schedule.
 *
 * @param oldCourseIDs - An array of UTRP v1 course IDs to be migrated.
 * @returns A promise that resolves when the migration is complete.
 *
 * This hook performs the following steps:
 * 1. Generates links for each UTRP v1 course ID.
 * 2. Fetches the course details from the generated links.
 * 3. Scrapes the course information from the fetched HTML.
 * 4. Checks if the course was found and adds it to the active schedule if it doesn't already exist.
 *
 * Notes:
 * - Chrome warns in the console that in the future, cookies will not work when we do a network request like how we are doing it now, so might need to open a new tab instead.
 */
export const useCourseMigration = async (oldCourseIDs: number[]): Promise<void> => {
    const { activeSchedule } = useFlattenedCourseSchedule();

    // Loop over the old course IDs and generate links
    const links = oldCourseIDs.map(
        courseID => `https://utdirect.utexas.edu/apps/registrar/course_schedule/${SEMESTER_CODE}/${courseID}/`
    );

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
                addCourse(activeSchedule.id, course);
            }
        } else {
            console.log(courses);
        }
    }
};
