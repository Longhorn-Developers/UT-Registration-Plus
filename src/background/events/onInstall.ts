import { ExtensionStore } from '../../shared/storage/ExtensionStore';

/**
 * Called when the extension is first installed or synced onto a new machine
 */
export default async function onInstall() {
    await ExtensionStore.set('version', chrome.runtime.getManifest().version);
}
