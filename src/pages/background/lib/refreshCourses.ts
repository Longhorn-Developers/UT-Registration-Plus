import type { Serialized } from "@chrome-extension-toolkit";
import { UserScheduleStore } from "@shared/storage/UserScheduleStore";
import type { Course } from "@shared/types/Course";

import ensureOffscreenDocument from "./ensureOffscreenDocument";

/**
 * Refreshes all course data for the active schedule by scraping UT's course catalog.
 * Updates courses directly in UserScheduleStore, preserving user-set properties (colors).
 *
 * Parsing is delegated to an offscreen document since service workers don't have DOM access.
 */
export default async function refreshCourses(): Promise<void> {
    const schedules = await UserScheduleStore.get("schedules");
    const activeIndex = await UserScheduleStore.get("activeIndex");
    const activeSchedule = schedules[activeIndex];

    if (!activeSchedule || activeSchedule.courses.length === 0) {
        return;
    }

    await ensureOffscreenDocument();

    type ScrapeResult =
        | { needsLogin: true; url: string }
        | { uniqueId: number; course: Serialized<Course> };

    const tasks = activeSchedule.courses.map(
        async (course): Promise<ScrapeResult | null> => {
            try {
                const response = await fetch(course.url, {
                    credentials: "include",
                });
                if (
                    response.redirected ||
                    response.status === 401 ||
                    response.status === 403
                ) {
                    return { needsLogin: true, url: course.url };
                }
                const htmlText = await response.text();

                const result = await chrome.runtime.sendMessage({
                    target: "offscreen",
                    type: "PARSE_COURSE",
                    data: {
                        html: htmlText,
                        url: course.url,
                        uniqueId: course.uniqueId,
                    },
                });

                if (result?.course) {
                    return { uniqueId: course.uniqueId, course: result.course };
                }
                return null;
            } catch (error) {
                console.error(
                    `Failed to scrape course ${course.uniqueId}:`,
                    error,
                );
                return null;
            }
        },
    );

    const results = await Promise.all(tasks);

    const loginRequired = results.find(
        (r): r is { needsLogin: true; url: string } =>
            r !== null && "needsLogin" in r,
    );
    if (loginRequired) {
        chrome.tabs.create({ url: loginRequired.url });
        return;
    }

    const scrapedByUniqueId = new Map<number, Serialized<Course>>();
    for (const result of results) {
        if (result && "uniqueId" in result) {
            scrapedByUniqueId.set(result.uniqueId, result.course);
        }
    }

    const updatedCourses = activeSchedule.courses.map((existing) => {
        const scraped = scrapedByUniqueId.get(existing.uniqueId);
        if (!scraped) return existing;

        return {
            ...scraped,
            colors: existing.colors,
            scrapedAt: Date.now(),
        };
    });

    const updatedSchedules = [...schedules];
    updatedSchedules[activeIndex] = {
        ...activeSchedule,
        courses: updatedCourses,
        updatedAt: Date.now(),
        lastCheckedAt: Date.now(),
    };

    await UserScheduleStore.set("schedules", updatedSchedules);
}
