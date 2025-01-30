import { ExtensionStore } from '@shared/storage/ExtensionStore';

/**
 * Called when the extension is updated (or when the extension is reloaded in development mode)
 */
export default async function onUpdate() {
    await ExtensionStore.bulkSet({
        version: browser.runtime.getManifest().version,
        lastUpdate: Date.now(),
    });
}
