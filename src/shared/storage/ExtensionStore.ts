import { createLocalStore } from '@chrome-extension-toolkit';
import { generateRandomId } from '@shared/util/random';

/**
 * A store that is used for storing user options
 */
interface IExtensionStore {
    /** These values are cached in storage, so that we can know the previous version that the extension was before the current update. Is only used for onUpdate */
    version: string;
    /** When was the last update */
    lastUpdate: number;
    /** The last version of the "What's New" popup that was shown to the user */
    lastWhatsNewPopupVersion: number;
    /** Stable anonymous ID for Sentry user correlation (no PII) */
    anonymousId: string;
    /** Google Calendar ID created for each exported schedule, keyed by schedule ID, so re-exporting replaces instead of duplicating */
    googleCalendarIds: Record<string, string>;
}

export const ExtensionStore = createLocalStore<IExtensionStore>(
    'ExtensionStore',
    {
        version: chrome.runtime.getManifest().version,
        lastUpdate: Date.now(),
        lastWhatsNewPopupVersion: 0,
        anonymousId: generateRandomId(),
        googleCalendarIds: {},
    },
    {
        usePrefix: false,
    }
);

// debugStore({ ExtensionStore });
