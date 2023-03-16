import { extensionStore } from '../../shared/storage/extensionStore';

/**
 * Called when the extension is first installed or synced onto a new machine
 */
export default async function onInstall() {
    await extensionStore.set('version', chrome.runtime.getManifest().version);
}
