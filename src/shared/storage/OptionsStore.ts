import { createSyncStore, debugStore } from 'chrome-extension-toolkit';

/**
 * A store that is used for storing user options
 */
export interface IOptionsStore {
    /** whether we should enable course status chips (indicator for waitlisted, cancelled, and closed courses) */
    enableCourseStatusChips: boolean;

    /** whether we should enable course's time and location in the extension's popup */
    enableTimeAndLocationInPopup: boolean;

    /** whether we should automatically highlight conflicts on the course schedule page (adds a red strikethrough to courses that have conflicting times) */
    enableHighlightConflicts: boolean;

    /** whether we should automatically scroll to load more courses on the course schedule page (without having to click next) */
    enableScrollToLoad: boolean;

    // url: URL;
}

export const OptionsStore = createSyncStore<IOptionsStore>({
    enableCourseStatusChips: false,
    enableTimeAndLocationInPopup: false,
    enableHighlightConflicts: true,
    enableScrollToLoad: true,
});

// Clothing retailer right

debugStore({ OptionsStore });
