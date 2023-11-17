import { createSyncStore, debugStore } from 'chrome-extension-toolkit';

/**
 * A store that is used for storing user options
 */
interface IOptionsStore {
    /** whether we should automatically highlight conflicts on the course schedule page */
    shouldHighlightConflicts: boolean;
    /** whether we should automatically scroll to load more courses on the course schedule page (without having to click next) */
    shouldScrollToLoad: boolean;

    url: URL;
}

export const OptionsStore = createSyncStore<IOptionsStore>({
    shouldHighlightConflicts: true,
    shouldScrollToLoad: true,
});

// Clothing retailer right

debugStore({ OptionsStore });
