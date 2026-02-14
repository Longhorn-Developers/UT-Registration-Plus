import { StatusCheckerStore } from '@shared/storage/StatusCheckerStore';
import { UserScheduleStore } from '@shared/storage/UserScheduleStore';
import type { StatusType } from '@shared/types/Course';
import { validateLoginStatus } from '@shared/util/checkLoginStatus';
import { CourseCatalogScraper } from '@views/lib/CourseCatalogScraper';
import getCourseTableRows from '@views/lib/getCourseTableRows';
import { SiteSupport } from '@views/lib/getSiteSupport';

const COOLDOWN_MS = 3000;

/**
 * Refreshes the course statuses for the active schedule by scraping UT's course catalog.
 * Enforces a 3-second cooldown between refreshes.
 * Uses merge-safe writes so that a partial failure doesn't erase previously scraped statuses.
 *
 * @returns A record mapping course unique IDs to their current status
 */
export default async function refreshCourseStatuses(): Promise<Record<number, StatusType>> {
    // 1. Check cooldown
    const lastCheckedAt = await StatusCheckerStore.get('lastCheckedAt');
    if (lastCheckedAt !== null && Date.now() - lastCheckedAt < COOLDOWN_MS) {
        return StatusCheckerStore.get('scrapeInfo');
    }

    // 2. Get active schedule
    const schedules = await UserScheduleStore.get('schedules');
    const activeIndex = await UserScheduleStore.get('activeIndex');
    const activeSchedule = schedules[activeIndex];

    if (!activeSchedule || activeSchedule.courses.length === 0) {
        return {};
    }

    // 3. Check login status using the first course's URL
    const isLoggedIn = await validateLoginStatus(activeSchedule.courses[0]!.url);
    if (!isLoggedIn) {
        return {};
    }

    // 4. Merge-safe scrape: start from existing data so failed courses keep their old value
    const existing = await StatusCheckerStore.get('scrapeInfo');
    const merged: Record<number, StatusType> = { ...existing };

    for (const course of activeSchedule.courses) {
        try {
            const response = await fetch(course.url, { credentials: 'include' });
            const htmlText = await response.text();
            const doc = new DOMParser().parseFromString(htmlText, 'text/html');

            const scraper = new CourseCatalogScraper(SiteSupport.COURSE_CATALOG_DETAILS, doc, course.url);
            const tableRows = getCourseTableRows(doc);
            const scrapedCourses = scraper.scrape(tableRows, false);

            if (scrapedCourses.length > 0 && scrapedCourses[0]?.course) {
                merged[course.uniqueId] = scrapedCourses[0].course.status;
            }
        } catch (error) {
            console.error(`Failed to scrape status for course ${course.uniqueId}:`, error);
            // Keep old value in merged (merge-safe)
        }
    }

    // 5. Write merged results and timestamp
    await StatusCheckerStore.set('scrapeInfo', merged);
    await StatusCheckerStore.set('lastCheckedAt', Date.now());

    return merged;
}
