import { createLocalStore } from '@chrome-extension-toolkit';
import type { ScheduleSyncProblem } from '@pages/background/lib/scheduleSync';

/**
 * What went wrong with the last schedule sync on this device, if anything, for the settings page to show
 */
export const ScheduleSyncStore = createLocalStore<{ problem: ScheduleSyncProblem }>('ScheduleSyncStore', {
    problem: null,
});
