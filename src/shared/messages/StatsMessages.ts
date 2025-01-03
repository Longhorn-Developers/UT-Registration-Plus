/**
 * Messages to the background script for usage statistics
 */
interface StatsMessages {
    interactedWithScheduling: () => void;
    openedCourseDetails: () => void;
    // openedCalendar: () => void;
    infiniteScrolled: () => void;
}

export type { StatsMessages };
