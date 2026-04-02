import type { Serialized } from '@chrome-extension-toolkit';
import { UserScheduleStore } from '@shared/storage/UserScheduleStore';
import type { Course } from '@shared/types/Course';
import type { UserSchedule } from '@shared/types/UserSchedule';
import { validateLoginStatus } from '@shared/util/checkLoginStatus';
import { CourseCatalogScraper } from '@views/lib/CourseCatalogScraper';
import getCourseTableRows from '@views/lib/getCourseTableRows';
import { SiteSupport } from '@views/lib/getSiteSupport';

const UTRP_LOGIN_URL = 'https://utdirect.utexas.edu/apps/registrar/course_schedule/utrp_login/';

/**
 * Scrapes a single course page and returns the parsed Course, or null on failure.
 */
function scrapeCourseFromHTML(htmlText: string, url: string): Course | null {
    const doc = new DOMParser().parseFromString(htmlText, 'text/html');
    const scraper = new CourseCatalogScraper(SiteSupport.COURSE_CATALOG_DETAILS, doc, url);
    const tableRows = getCourseTableRows(doc);
    const scrapedCourses = scraper.scrape(tableRows, false);

    if (scrapedCourses.length === 0 || !scrapedCourses[0]?.course) return null;

    const course = scrapedCourses[0].course;
    course.description = scraper.getDescription(doc);
    return course;
}

/**
 * Re-scrapes every course in the given schedule and returns updated courses.
 * Preserves user-set properties (colors). Courses that fail to scrape keep their existing data.
 *
 * Must be called from a page context (not the background service worker) as it relies on DOMParser.
 */
export async function refreshScheduleCourses(schedule: Serialized<UserSchedule>): Promise<Serialized<Course>[]> {
    const results = await Promise.all(
        schedule.courses.map(async (course): Promise<Serialized<Course> | null> => {
            try {
                const response = await fetch(course.url, { credentials: 'include' });
                if (!response.ok) return null;

                const htmlText = await response.text();
                const scraped = scrapeCourseFromHTML(htmlText, course.url);
                return scraped as unknown as Serialized<Course> | null;
            } catch (error) {
                console.error(`Failed to scrape course ${course.uniqueId}:`, error);
                return null;
            }
        })
    );

    return schedule.courses.map((existing, i) => {
        const scraped = results[i];
        if (!scraped) return existing;

        return {
            ...scraped,
            colors: existing.colors,
            scrapedAt: Date.now(),
        };
    });
}

/**
 * Refreshes all course data for the active schedule.
 * Checks login status first, then scrapes and persists updated data.
 *
 * @returns true if refresh completed, false if login was required
 */
export default async function refreshCourses(): Promise<boolean> {
    const [schedules, activeIndex] = await Promise.all([
        UserScheduleStore.get('schedules'),
        UserScheduleStore.get('activeIndex'),
    ]);
    const activeSchedule = schedules[activeIndex];

    if (!activeSchedule || activeSchedule.courses.length === 0) {
        return true;
    }

    const loggedIn = await validateLoginStatus(UTRP_LOGIN_URL);
    if (!loggedIn) return false;

    const updatedCourses = await refreshScheduleCourses(activeSchedule);

    const updatedSchedules = [...schedules];
    updatedSchedules[activeIndex] = {
        ...activeSchedule,
        courses: updatedCourses,
        updatedAt: Date.now(),
        lastCheckedAt: Date.now(),
    };

    await UserScheduleStore.set('schedules', updatedSchedules);
    return true;
}
