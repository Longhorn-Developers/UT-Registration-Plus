import { createLocalStore } from '@chrome-extension-toolkit';
import type { ScheduleSyncProblem, ScheduleSyncState } from '@shared/types/ScheduleSync';

interface IScheduleSyncStore {
    /** What went wrong with the last sync on this device, for the settings page to show */
    problem: ScheduleSyncProblem;
    /** What this device last synced, to tell its own changes from other computers' */
    state: ScheduleSyncState | null;
}

/**
 * A store that is used for keeping track of the schedule sync on this computer
 */
export const ScheduleSyncStore = createLocalStore<IScheduleSyncStore>('ScheduleSyncStore', {
    problem: null,
    state: null,
});
