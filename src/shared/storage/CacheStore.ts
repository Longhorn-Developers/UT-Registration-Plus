import type { CachedData } from '@shared/types/CachedData';
import { createLocalStore, debugStore } from 'chrome-extension-toolkit';

interface ICacheStore {
    github: Record<string, CachedData<unknown>>;
}

/**
 * A store that is used for storing cached data such as GitHub contributors
 */
export const CacheStore = createLocalStore<ICacheStore>({
    github: {},
});

debugStore({ cacheStore: CacheStore });
