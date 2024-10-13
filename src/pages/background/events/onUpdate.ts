import { ExtensionStore } from '@shared/storage/ExtensionStore';

import migrateUTRPv1Courses from '../lib/migrateUTRPv1Courses';

/**
 * Called when the extension is updated (or when the extension is reloaded in development mode)
 */
export default async function onUpdate() {
    await ExtensionStore.set({
        version: chrome.runtime.getManifest().version,
        lastUpdate: Date.now(),
    });
    migrateUTRPv1Courses();
}
