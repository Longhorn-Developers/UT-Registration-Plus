import { createSyncStore } from '@chrome-extension-toolkit';

export interface MigrationState {
    /** Tracks which settings updates have already been applied; used to run pending migrations in order */
    schemaVersion: number;
}

export const MigrationStore = createSyncStore<MigrationState>(
    'MigrationStore',
    { schemaVersion: 0 },
    { usePrefix: false }
);
