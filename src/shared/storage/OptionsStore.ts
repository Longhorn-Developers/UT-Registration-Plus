import { createSyncStore, debugStore } from 'chrome-extension-toolkit';

/**
 * A store that is used for storing user options
 */
export interface IOptionsStore {
    /** whether we should enable course status chips (indicator for waitlisted, cancelled, and closed courses) */
    enableCourseStatusChips: boolean;

    /** whether we should automatically highlight conflicts on the course schedule page (adds a red strikethrough to courses that have conflicting times) */
    enableHighlightConflicts: boolean;

    /** whether we should automatically scroll to load more courses on the course schedule page (without having to click next) */
    enableScrollToLoad: boolean;

    /** whether we should automatically refresh the data for the waitlist, course status, and other info with the latest data from UT's site */
    enableDataRefreshing: boolean;

    /** whether we should open the calendar in a new tab; default is to focus an existing calendar tab */
    alwaysOpenCalendarInNewTab: boolean;

    /** whether the calendar sidebar should be shown when the calendar is opened */
    showCalendarSidebar: boolean;

    /** whether the promo should be shown */
    showUTDiningPromo: boolean;
}

export const OptionsStore = createSyncStore<IOptionsStore>({
    enableCourseStatusChips: false,
    enableHighlightConflicts: true,
    enableScrollToLoad: true,
    enableDataRefreshing: false,
    alwaysOpenCalendarInNewTab: false,
    showCalendarSidebar: true,
    showUTDiningPromo: true,
});

/**
 * Initializes the settings by retrieving the values from the OptionsStore.
 *
 * @returns A promise that resolves to an object satisfying the IOptionsStore interface.
 */
export const initSettings = async () =>
    ({
        enableCourseStatusChips: await OptionsStore.get('enableCourseStatusChips'),
        enableHighlightConflicts: await OptionsStore.get('enableHighlightConflicts'),
        enableScrollToLoad: await OptionsStore.get('enableScrollToLoad'),
        enableDataRefreshing: await OptionsStore.get('enableDataRefreshing'),
        alwaysOpenCalendarInNewTab: await OptionsStore.get('alwaysOpenCalendarInNewTab'),
        showCalendarSidebar: await OptionsStore.get('showCalendarSidebar'),
        showUTDiningPromo: await OptionsStore.get('showUTDiningPromo'),
    }) satisfies IOptionsStore;

// Clothing retailer right

debugStore({ OptionsStore });
