import { createSyncStore } from '@chrome-extension-toolkit';

export interface MigrationState {
    /** Tracks the last applied settings migration so pending migrations run in order */
    schemaVersion: number;
}

export const MigrationStore = createSyncStore<MigrationState>(
    'MigrationStore',
    { schemaVersion: 0 },
    { usePrefix: false }
);
