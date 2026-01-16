import { createSyncStore } from 'chrome-extension-toolkit';

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
    /** whether users are allowed to bypass the 10 schedule limit */
    allowMoreSchedules: boolean;
}

const defaults: IOptionsStore = {
    enableCourseStatusChips: false,
    enableHighlightConflicts: true,
    enableScrollToLoad: true,
    enableDataRefreshing: false,
    alwaysOpenCalendarInNewTab: false,
    showCalendarSidebar: true,
    showUTDiningPromo: true,
    allowMoreSchedules: false,
};

/**
 * A store that is used for storing user options.
 * Wrapped with auto-initialization and fallback to defaults if storage APIs fail.
 */
export const OptionsStore = createSyncStore<IOptionsStore>('optionsStore', defaults);

let initPromise: Promise<void> | null = null;

async function ensureInitialized() {
    if (initPromise) return initPromise;
    initPromise = (async () => {
        try {
            await OptionsStore.initialize?.();
        } catch {
            // storage not ready — that's ok, we'll use in-memory fallback
        }
    })();
    return initPromise;
}

// Wrap get/set to ensure init is called first and provide fallback
const originalGet = OptionsStore.get.bind(OptionsStore);
const originalSet = OptionsStore.set.bind(OptionsStore);

OptionsStore.get = async function <K extends keyof IOptionsStore>(key: K) {
    await ensureInitialized();
    try {
        return await originalGet(key);
    } catch {
        return defaults[key];
    }
} as typeof OptionsStore.get;

OptionsStore.set = async function <K extends keyof IOptionsStore>(key: K | Partial<IOptionsStore>, value?: any) {
    await ensureInitialized();
    try {
        if (typeof key === 'string') {
            return await originalSet(key, value);
        }
        return await originalSet(key);
    } catch {
        // storage failed silently — in-memory only
    }
} as typeof OptionsStore.set;

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
        allowMoreSchedules: await OptionsStore.get('allowMoreSchedules'),
    }) satisfies IOptionsStore;
