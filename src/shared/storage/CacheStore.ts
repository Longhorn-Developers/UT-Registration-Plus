import type { CachedData } from '@shared/types/CachedData';
import { createLocalStore, debugStore } from 'chrome-extension-toolkit';

import { generateRandomId } from '../util/random';

interface ICacheStore {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    github: Record<string, CachedData<any>>;
}

/**
 * A store that is used for storing cached data such as GitHub contributors
 */
export const CacheStore = createLocalStore<ICacheStore>({
    github: {}
});

debugStore({ cacheStore: CacheStore });
