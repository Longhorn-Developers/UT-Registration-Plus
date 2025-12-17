import { createLocalStore } from 'chrome-extension-toolkit';

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
}

// Use the global 'chrome' object which is available in both Chrome and Firefox extensions
const getManifestVersion = () => {
    // Firefox and Chrome both make chrome.runtime available in extensions
    const manifest = (
        typeof chrome !== 'undefined'
            ? chrome
            : typeof (globalThis as any).browser !== 'undefined'
              ? (globalThis as any).browser
              : null
    )?.runtime?.getManifest?.();
    return manifest?.version ?? '0.0.0';
};

export const ExtensionStore = createLocalStore<IExtensionStore>('extensionStore', {
    version: getManifestVersion(),
    lastUpdate: Date.now(),
    lastWhatsNewPopupVersion: 0,
});
