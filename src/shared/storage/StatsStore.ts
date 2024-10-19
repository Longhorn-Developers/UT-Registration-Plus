import { createSyncStore, debugStore } from 'chrome-extension-toolkit';

/**
 * A store that is used for storing various usage statistics
 */
export interface IStatsStore {
    /* The number of unique minutes spent interacting with scheduling in some form */
    minutesScheduling: number;

    /* The number of times the CourseCatalogInjectedPopup was opened */
    timesOpenedCourseDetails: number;

    /* The number of times the calendar page is opened */
    timesOpenedCalendar: number;

    /* UTRP does infinite scrolling on the course catalog, instead of pagination (prev/next buttons).
       This is the number of times that we perform that action for the user automatically */
    timesInfiniteScrolled: number;
}

export const StatsStore = createSyncStore<IStatsStore>({
    minutesScheduling: 0,
    timesOpenedCourseDetails: 0,
    timesOpenedCalendar: 0,
    timesInfiniteScrolled: 0,
});

debugStore({ StatsStore });
