import type { StatusType } from '@shared/types/Course';

/**
 * Messages that can be sent to the background script for status checking operations
 */
export interface StatusCheckerBackgroundMessages {
    /**
     * Refreshes the course statuses for the active schedule by scraping UT's course catalog.
     * Enforces a 3-second cooldown between refreshes.
     *
     * @returns A record mapping course unique IDs to their current status
     */
    refreshCourseStatuses: (data: {}) => Record<number, StatusType>;

    /**
     * Gets the timestamp of the last status check
     *
     * @returns The unix timestamp of the last check, or null if never checked
     */
    getLastCheckedAt: (data: {}) => number | null;
}
