import type { Serializable } from '@chrome-extension-toolkit';
import { createLocalStore } from '@chrome-extension-toolkit';
import browser from 'webextension-polyfill';

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

const getManifestVersion = (): string => {
    const manifest = browser.runtime.getManifest();
    return manifest?.version ?? '0.0.0';
};

const defaults: IExtensionStore = {
    version: getManifestVersion(),
    lastUpdate: Date.now(),
    lastWhatsNewPopupVersion: 0,
};

/**
 * A store that is used for storing user options.
 */
export const ExtensionStore = createLocalStore<IExtensionStore>('ExtensionStore', defaults);

let initPromise: Promise<void> | null = null;

async function ensureInitialized() {
    if (initPromise) return initPromise;
    initPromise = (async () => {
        try {
            await ExtensionStore.initialize?.();
        } catch {
            // storage not ready
        }
    })();
    return initPromise;
}

// Wrap get/set to ensure init is called first and provide fallback
const originalGet = ExtensionStore.get.bind(ExtensionStore);
const originalSet = ExtensionStore.set.bind(ExtensionStore);

ExtensionStore.get = async function get<K extends keyof IExtensionStore>(key: K) {
    await ensureInitialized();
    try {
        return await originalGet(key);
    } catch {
        return defaults[key];
    }
} as typeof ExtensionStore.get;

ExtensionStore.set = async function set<K extends keyof IExtensionStore>(
    key: K | Partial<IExtensionStore>,
    value?: Serializable<IExtensionStore[K]>
) {
    await ensureInitialized();
    try {
        if (typeof key === 'string') {
            return await originalSet(key, value as Serializable<IExtensionStore[K]>);
        }
        return await originalSet(key);
    } catch {
        // storage failed silently
    }
} as typeof ExtensionStore.set;

// debugStore({ ExtensionStore });
