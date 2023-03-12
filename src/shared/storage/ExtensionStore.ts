import { v4 as uuidv4 } from 'uuid';
import { createLocalStore, debugStore } from 'chrome-extension-toolkit';

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

interface Actions {
    getDeviceId(): Promise<string>;
}

export const ExtensionStore = createLocalStore<IExtensionStore, Actions>(
    {
        version: chrome.runtime.getManifest().version,
        lastUpdate: Date.now(),
        deviceId: '',
    },
    store => ({
        getDeviceId: async () => {
            const deviceId = await store.getDeviceId();
            if (deviceId) {
                return deviceId;
            }
            const newDeviceId = uuidv4();
            await store.setDeviceId(newDeviceId);
            return newDeviceId;
        },
    })
);

debugStore({ ExtensionStore });
