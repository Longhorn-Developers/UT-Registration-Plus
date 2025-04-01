import { ExtensionStore } from '@shared/storage/ExtensionStore';
import { UserScheduleStore } from '@shared/storage/UserScheduleStore';

import createSchedule from '../lib/createSchedule';

/**
 * Called when the extension is updated (or when the extension is reloaded in development mode)
 */
export default async function onUpdate() {
    await ExtensionStore.set({
        version: chrome.runtime.getManifest().version,
        lastUpdate: Date.now(),
    });

    const schedules = await UserScheduleStore.get('schedules');

    // By invariant, there must always be at least one schedule
    if (schedules.length === 0) {
        createSchedule('Schedule 1');
    }
}
