import { createLocalStore, debugStore } from 'chrome-extension-toolkit';

/**
 * A store that is used for storing user options
 */
interface IExtensionStore {
    /** These values are cached in storage, so that we can know the previous version that the extension was before the current update. Is only used for onUpdate */
    version: string;
    /** When was the last update */
    lastUpdate: number;
    /** User was shown the new features dialog */
    newFeaturesDialogShown: boolean;
}

export const ExtensionStore = createLocalStore<IExtensionStore>({
    version: chrome.runtime.getManifest().version,
    lastUpdate: Date.now(),
    newFeaturesDialogShown: false,
});

debugStore({ ExtensionStore });
