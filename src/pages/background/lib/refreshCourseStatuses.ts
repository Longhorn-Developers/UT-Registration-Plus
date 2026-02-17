import { StatusCheckerStore } from '@shared/storage/StatusCheckerStore';
import { UserScheduleStore } from '@shared/storage/UserScheduleStore';
import type { StatusType } from '@shared/types/Course';

import ensureOffscreenDocument from './ensureOffscreenDocument';

const COOLDOWN_MS = 3000;

/**
 * Refreshes the course statuses for the active schedule by scraping UT's course catalog.
 * Enforces a 3-second cooldown between refreshes.
 * Uses merge-safe writes so that a partial failure doesn't erase previously scraped statuses.
 *
 * Parsing is delegated to an offscreen document since service workers don't have DOM access.
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

    // 3. Ensure offscreen document exists for parsing
    await ensureOffscreenDocument();

    // 4. Merge-safe scrape: start from existing data so failed courses keep their old value
    const existing = await StatusCheckerStore.get('scrapeInfo');
    const merged: Record<number, StatusType> = { ...existing };

    for (const course of activeSchedule.courses) {
        try {
            const response = await fetch(course.url, { credentials: 'include' });
            if (response.redirected || response.status === 401 || response.status === 403) {
                chrome.tabs.create({ url: course.url });
                return {};
            }
            const htmlText = await response.text();

            // Delegate HTML parsing to offscreen document (service workers can't use DOMParser)
            const result = await chrome.runtime.sendMessage({
                target: 'offscreen',
                type: 'PARSE_COURSE_STATUS',
                data: {
                    html: htmlText,
                    url: course.url,
                    uniqueId: course.uniqueId,
                },
            });

            if (result?.status) {
                merged[course.uniqueId] = result.status;
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
