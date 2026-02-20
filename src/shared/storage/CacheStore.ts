import type { Serializable } from '@chrome-extension-toolkit';
import { createLocalStore } from '@chrome-extension-toolkit';
import type { CachedData } from '@shared/types/CachedData';

interface ICacheStore {
    github: Record<string, CachedData<unknown>>;
}

const defaults: ICacheStore = {
    github: {},
};

/**
 * A store that is used for storing cached data such as GitHub contributors.
 * Wrapped with auto-initialization and fallback to defaults if storage APIs fail.
 */
export const CacheStore = createLocalStore<ICacheStore>('CacheStore', defaults);

let initPromise: Promise<void> | null = null;

async function ensureInitialized() {
    if (initPromise) return initPromise;
    initPromise = (async () => {
        try {
            await CacheStore.initialize?.();
        } catch {
            // storage not ready
        }
    })();
    return initPromise;
}

// ensure init is called first and provide fallback
const originalGet = CacheStore.get.bind(CacheStore);
const originalSet = CacheStore.set.bind(CacheStore);

CacheStore.get = async function get<K extends keyof ICacheStore>(key: K) {
    await ensureInitialized();
    try {
        return await originalGet(key);
    } catch {
        return defaults[key];
    }
} as typeof CacheStore.get;

CacheStore.set = async function set<K extends keyof ICacheStore>(
    key: K | Partial<ICacheStore>,
    value?: Serializable<ICacheStore[K]>
) {
    await ensureInitialized();
    try {
        if (typeof key === 'string') {
            return await originalSet(key, value as Serializable<ICacheStore[K]>);
        }
        return await originalSet(key);
    } catch {
        // storage failed silently
    }
} as typeof CacheStore.set;

// debugStore({ cacheStore: CacheStore });
