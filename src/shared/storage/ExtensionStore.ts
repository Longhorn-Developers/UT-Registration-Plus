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

const defaults: IExtensionStore = {
    version: getManifestVersion(),
    lastUpdate: Date.now(),
    lastWhatsNewPopupVersion: 0,
};

/**
 * A store that is used for storing user options.
 * Wrapped with auto-initialization and fallback to defaults if storage APIs fail.
 */
export const ExtensionStore = createLocalStore<IExtensionStore>('extensionStore', defaults);

let initPromise: Promise<void> | null = null;

async function ensureInitialized() {
    if (initPromise) return initPromise;
    initPromise = (async () => {
        try {
            await ExtensionStore.initialize?.();
        } catch {
            // storage not ready — that's ok, we'll use in-memory fallback
        }
    })();
    return initPromise;
}

// Wrap get/set to ensure init is called first and provide fallback
const originalGet = ExtensionStore.get.bind(ExtensionStore);
const originalSet = ExtensionStore.set.bind(ExtensionStore);

ExtensionStore.get = async function <K extends keyof IExtensionStore>(key: K) {
    await ensureInitialized();
    try {
        return await originalGet(key);
    } catch {
        return defaults[key];
    }
} as typeof ExtensionStore.get;

ExtensionStore.set = async function <K extends keyof IExtensionStore>(key: K | Partial<IExtensionStore>, value?: any) {
    await ensureInitialized();
    try {
        if (typeof key === 'string') {
            return await originalSet(key, value);
        }
        return await originalSet(key);
    } catch {
        // storage failed silently — in-memory only
    }
} as typeof ExtensionStore.set;
