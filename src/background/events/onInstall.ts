import { SECOND } from 'src/shared/util/time';

/**
 * Called when the extension is first installed or synced onto a new machine
 */
export default async function onInstall() {
    // set the uninstall url
    chrome.runtime.setUninstallURL('https://www.google.com');
    logOnInstallEvent();
}

/**
 * making sure we are not sending duplicate install event for users that have synced browsers
 *  sync storage get's cleared on browser uninstall, so re-installing the browser will trigger the event
 */
function logOnInstallEvent() {
    setTimeout(async () => {
        const manifest = chrome.runtime.getManifest();
        const INSTALL_KEY = `${manifest.short_name}-installed`;
        const storage = await chrome.storage.sync.get(INSTALL_KEY);
        if (!storage[INSTALL_KEY]) {
            // TODO: send install event
            await chrome.storage.sync.set({ [INSTALL_KEY]: true });
        }
    }, 5 * SECOND);
}
