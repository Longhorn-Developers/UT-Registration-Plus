// eslint-disable-next-line import/no-restricted-paths
import addCourse from '@pages/background/lib/addCourse';
// eslint-disable-next-line import/no-restricted-paths
import { CourseCatalogScraper } from '@views/lib/CourseCatalogScraper';
// eslint-disable-next-line import/no-restricted-paths
import getCourseTableRows from '@views/lib/getCourseTableRows';
// eslint-disable-next-line import/no-restricted-paths
import { SiteSupport } from '@views/lib/getSiteSupport';

import type { UserSchedule } from '../types/UserSchedule';

// todo: move into a util/shared place, rather than specifically in settings
export const addCourseByUrl = async (link: string, schedule: UserSchedule) => {
    try {
        let response: Response;
        try {
            response = await fetch(link);
        } catch (e) {
            alert(`Failed to fetch url '${link}'`);
            return;
        }
        const text = await response.text();
        const doc = new DOMParser().parseFromString(text, 'text/html');

        const scraper = new CourseCatalogScraper(SiteSupport.COURSE_CATALOG_DETAILS, doc, link);
        const tableRows = getCourseTableRows(doc);
        const courses = scraper.scrape(tableRows, false);

        if (courses.length === 1) {
            const description = scraper.getDescription(doc);
            const row = courses[0]!;
            const course = row.course!;
            course.description = description;
            // console.log(course);

            if (schedule.courses.every(c => c.uniqueId !== course.uniqueId)) {
                console.log('adding course');
                addCourse(schedule.id, course);
            } else {
                console.log('course already exists');
            }
        } else {
            console.log(courses);
        }
    } catch (error) {
        console.error('Error scraping course:', error);
    }
};
