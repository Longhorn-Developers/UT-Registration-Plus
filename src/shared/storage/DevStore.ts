import { createLocalStore, debugStore } from 'chrome-extension-toolkit';

/**
 * A store that is used to store data that is only relevant during development
 */
interface IDevStore {
    /** whether the user is a developer */
    isDeveloper: boolean;
    /** the tabId for the debug tab */
    debugTabId: number;
    /** whether the debug tab is visible */
    wasDebugTabVisible: boolean;
    /** whether we should enable extension reloading */
    isExtensionReloading: boolean;
    /** whether we should enable tab reloading */
    isTabReloading: boolean;
    /** The id of the tab that we want to reload (after the extension reloads itself ) */
    reloadTabId: number;
}

const defaults: IDevStore = {
    isDeveloper: false,
    debugTabId: 0,
    isTabReloading: true,
    wasDebugTabVisible: false,
    isExtensionReloading: true,
    reloadTabId: 0,
} as const satisfies IDevStore;

/**
 * A store that is used to store data that is only relevant during development.
 * Wrapped with auto-initialization and fallback to defaults if storage APIs fail.
 */
export const DevStore = createLocalStore<IDevStore>(defaults);

let initPromise: Promise<void> | null = null;

async function ensureInitialized() {
    if (initPromise) return initPromise;
    initPromise = (async () => {
        try {
            await DevStore.initialize?.();
        } catch {
            // storage not ready — that's ok, we'll use in-memory fallback
        }
    })();
    return initPromise;
}

// Wrap get/set to ensure init is called first and provide fallback
const originalGet = DevStore.get.bind(DevStore);
const originalSet = DevStore.set.bind(DevStore);

DevStore.get = async function <K extends keyof IDevStore>(key: K) {
    await ensureInitialized();
    try {
        return await originalGet(key);
    } catch {
        return defaults[key];
    }
} as typeof DevStore.get;

DevStore.set = async function <K extends keyof IDevStore>(key: K | Partial<IDevStore>, value?: any) {
    await ensureInitialized();
    try {
        if (typeof key === 'string') {
            return await originalSet(key, value);
        }
        return await originalSet(key);
    } catch {
        // storage failed silently — in-memory only
    }
} as typeof DevStore.set;

debugStore({ devStore: DevStore });
