import { extensionStore } from '../../../shared/storage/ExtensionStore';

/**
 * Called when the extension is updated (or when the extension is reloaded in development mode)
 */
export default async function onUpdate() {
    await extensionStore.set({
        version: chrome.runtime.getManifest().version,
        lastUpdate: Date.now(),
    });

    // if (process.env.NODE_ENV === 'development') {
    //     hotReloadTab();
    // }
}
