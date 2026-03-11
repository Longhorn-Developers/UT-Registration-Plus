import type { Serialized } from '@chrome-extension-toolkit';
import type { Course } from '@shared/types/Course';
import { CourseCatalogScraper } from '@views/lib/CourseCatalogScraper';
import getCourseTableRows from '@views/lib/getCourseTableRows';
import { SiteSupport } from '@views/lib/getSiteSupport';

interface ParseCourseMessage {
    target: string;
    type: string;
    data: {
        html: string;
        url: string;
        uniqueId: number;
    };
}

interface ParseCourseResponse {
    course: Serialized<Course> | null;
}

/**
 * Offscreen document message listener for parsing course catalog HTML.
 * This runs in a hidden document with full DOM access, allowing us to use DOMParser
 * which is unavailable in the service worker context.
 */
chrome.runtime.onMessage.addListener(
    (message: ParseCourseMessage, _sender, sendResponse: (response: ParseCourseResponse) => void) => {
        if (message.target !== 'offscreen') {
            return false;
        }

        if (message.type === 'PARSE_COURSE') {
            (async () => {
                try {
                    const { html, url } = message.data;

                    const doc = new DOMParser().parseFromString(html, 'text/html');

                    const scraper = new CourseCatalogScraper(SiteSupport.COURSE_CATALOG_DETAILS, doc, url);
                    const tableRows = getCourseTableRows(doc);
                    const scrapedCourses = scraper.scrape(tableRows, false);

                    const course =
                        scrapedCourses.length > 0 && scrapedCourses[0]?.course
                            ? (scrapedCourses[0].course as unknown as Serialized<Course>)
                            : null;

                    sendResponse({ course });
                } catch (error) {
                    console.error('Failed to parse course in offscreen document:', error);
                    sendResponse({ course: null });
                }
            })();

            return true;
        }

        return false;
    }
);

console.log('Offscreen document loaded and ready to parse courses');
