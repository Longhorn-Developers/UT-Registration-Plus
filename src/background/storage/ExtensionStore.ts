import { v4 as uuidv4 } from 'uuid';
import { createStore } from 'chrome-extension-toolkit';

/**
 * A store that is used for storing user options
 */
interface IExtensionStore {
    /** These values are cached in storage, so that we can know the previous version that the extension was before the current update. Is only used for onUpdate */
    version: string;
    /** When was the last update */
    lastUpdate: number;
    /** A unique identifier generated for the current user in lieu of a userId */
    deviceId: string;
}

const base = createStore<IExtensionStore>('EXTENSION_STORE', {
    version: chrome.runtime.getManifest().version,
    lastUpdate: Date.now(),
    deviceId: '',
});

export const ExtensionStore = base.modify({
    async getDeviceId() {
        const deviceId = await base.getDeviceId();
        if (deviceId) {
            return deviceId;
        }
        const newDeviceId = uuidv4();
        return newDeviceId;
    },
});
