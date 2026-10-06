import { ExtensionStore } from '@shared/storage/ExtensionStore';
import { UserScheduleStore } from '@shared/storage/UserScheduleStore';
import { MigrationStore } from 'src/shared/storage/hasMigrated';
import { OptionsStore } from 'src/shared/storage/OptionsStore';
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

    const migrationCompleted = await MigrationStore.get('courseSettingsMigrationCompleted');

    // Set data refreshing and course status indicators to on by default, since they were previously in-beta and disabled
    if (!migrationCompleted) {
        await OptionsStore.set({
            enableDataRefreshing: true,
            enableCourseStatusChips: true,
        });

        await MigrationStore.set('courseSettingsMigrationCompleted', true);
    }
}
