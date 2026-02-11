import { createLocalStore } from '@chrome-extension-toolkit';
import type { CachedData } from '@shared/types/CachedData';

interface ICacheStore {
    github: Record<string, CachedData<unknown>>;
}

/**
 * A store that is used for storing cached data such as GitHub contributors
 */
export const CacheStore = createLocalStore<ICacheStore>('CacheStore', {
    github: {},
});

// debugStore({ cacheStore: CacheStore });
