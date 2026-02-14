import { createLocalStore } from '@chrome-extension-toolkit';
import type { StatusType } from '@shared/types/Course';

interface IStatusCheckerStore {
    lastCheckedAt: number | null;
    scrapeInfo: Record<number, StatusType>;
}

/**
 * A store that is used for storing course status check results and the last time statuses were checked
 */
export const StatusCheckerStore = createLocalStore<IStatusCheckerStore>('StatusCheckerStore', {
    lastCheckedAt: null,
    scrapeInfo: {},
});

// debugStore({ statusCheckerStore: StatusCheckerStore });
