import { background } from '@shared/messages';
import type { Course } from '@shared/types/Course';
import { CourseCatalogScraper } from '@views/lib/CourseCatalogScraper';
import getCourseTableRows from '@views/lib/getCourseTableRows';
import { SiteSupport } from '@views/lib/getSiteSupport';

/**
 * Fetches and scrapes course details from a provided URL.
 *
 * This function must be called from a content script context (not the background service worker),
 * as it relies on DOMParser for HTML parsing. It uses the background fetch proxy to retrieve the HTML.
 *
 * @param link - The URL from which to fetch the course details.
 * @returns The scraped course, or undefined if scraping fails or no course is found.
 */
export async function getCourseByURL(link: string): Promise<Course | undefined> {
    const htmlText = await background.fetchFromUrl({
        url: link,
        method: 'GET',
        response: 'text',
    });

    if (!htmlText) return;

    const doc = new DOMParser().parseFromString(htmlText, 'text/html');
    const scraper = new CourseCatalogScraper(SiteSupport.COURSE_CATALOG_DETAILS, doc, link);
    const tableRows = getCourseTableRows(doc);
    const scrapedCourses = scraper.scrape(tableRows, false);

    if (scrapedCourses.length !== 1) return;

    const description = scraper.getDescription(doc);
    const row = scrapedCourses[0]!;
    const course = row.course!;
    course.description = description;

    return course;
}
