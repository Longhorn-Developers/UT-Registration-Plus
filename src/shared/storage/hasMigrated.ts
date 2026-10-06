import { createSyncStore } from '@chrome-extension-toolkit';

export interface MigrationState {
    /** True if settings have been successfully migrated after updating to the new version, false otherwise */
    courseSettingsMigrationCompleted: boolean;
}

export const MigrationStore = createSyncStore<MigrationState>(
    'MigrationStore',
    { courseSettingsMigrationCompleted: false },
    { usePrefix: false }
);
