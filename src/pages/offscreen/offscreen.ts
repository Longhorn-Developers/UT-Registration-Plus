import type { StatusType } from '@shared/types/Course';
import { CourseCatalogScraper } from '@views/lib/CourseCatalogScraper';
import getCourseTableRows from '@views/lib/getCourseTableRows';
import { SiteSupport } from '@views/lib/getSiteSupport';

interface ParseCourseStatusMessage {
    target: string;
    type: string;
    data: {
        html: string;
        url: string;
        uniqueId: number;
    };
}

interface ParseCourseStatusResponse {
    status: StatusType | null;
}

/**
 * Offscreen document message listener for parsing course catalog HTML.
 * This runs in a hidden document with full DOM access, allowing us to use DOMParser
 * which is unavailable in the service worker context.
 */
chrome.runtime.onMessage.addListener(
    (message: ParseCourseStatusMessage, _sender, sendResponse: (response: ParseCourseStatusResponse) => void) => {
        // Only handle messages targeted to the offscreen document
        if (message.target !== 'offscreen') {
            return false;
        }

        if (message.type === 'PARSE_COURSE_STATUS') {
            // Process async, but indicate we'll respond later
            (async () => {
                try {
                    const { html, url } = message.data;

                    // Parse the HTML string into a Document
                    const doc = new DOMParser().parseFromString(html, 'text/html');

                    // Use the same scraping logic as the original implementation
                    const scraper = new CourseCatalogScraper(SiteSupport.COURSE_CATALOG_DETAILS, doc, url);
                    const tableRows = getCourseTableRows(doc);
                    const scrapedCourses = scraper.scrape(tableRows, false);

                    // Extract the status from the first scraped course
                    const status =
                        scrapedCourses.length > 0 && scrapedCourses[0]?.course ? scrapedCourses[0].course.status : null;

                    sendResponse({ status });
                } catch (error) {
                    console.error('Failed to parse course status in offscreen document:', error);
                    sendResponse({ status: null });
                }
            })();

            // Return true to indicate we'll send an async response
            return true;
        }

        return false;
    }
);

console.log('Offscreen document loaded and ready to parse course status');
