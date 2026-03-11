import { createLocalStore } from '@chrome-extension-toolkit';
import type { CachedData } from '@shared/types/CachedData';
import type { GitHubStats } from '@shared/types/GitHubStats';

interface ICacheStore {
    githubStats: CachedData<Record<string, GitHubStats>> | null;
    githubNames: CachedData<Record<string, string>> | null;
}

/**
 * A store that is used for storing cached data such as GitHub contributors
 */
export const CacheStore = createLocalStore<ICacheStore>(
    'CacheStore',
    {
        githubStats: null,
        githubNames: null,
    },
    {
        usePrefix: false,
    }
);

// Remove the old monolithic github cache blob if it exists
chrome.storage.local.remove('github');
