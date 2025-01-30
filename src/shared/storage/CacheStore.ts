import type { CachedData } from '@shared/types/CachedData';
import { ExtensionStorage } from 'browser-extension-toolkit';

import type { ExtensionStorageData } from '../types/ExtensionStorage';

/**
 * A store that is used for storing cached data
 */
export interface ICacheStore extends ExtensionStorageData {
    github: Record<string, CachedData<unknown>>;
}

export const CacheStore = new ExtensionStorage<ICacheStore>({
    area: 'local',
    serialize: true,
});
