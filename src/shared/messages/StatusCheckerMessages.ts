/**
 * Messages that can be sent to the background script for course refresh operations
 */
export interface StatusCheckerBackgroundMessages {
    /**
     * Refreshes all course data for the active schedule by scraping UT's course catalog.
     * Enforces a 3-second cooldown between refreshes.
     */
    refreshCourses: (data: Record<string, never>) => void;
}
