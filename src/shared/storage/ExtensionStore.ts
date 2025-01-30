import { ExtensionStorage } from 'browser-extension-toolkit';

import type { ExtensionStorageData } from '../types/ExtensionStorage';

/**
 * A store that is used for storing user options
 */
export interface IExtensionStore extends ExtensionStorageData {
    /** These values are cached in storage, so that we can know the previous version that the extension was before the current update. Is only used for onUpdate */
    version: string;
    /** When was the last update */
    lastUpdate: number;
}

export const ExtensionStore = new ExtensionStorage<IExtensionStore>({
    area: 'local',
    serialize: true,
});

ExtensionStore.bulkSet({
    version: browser.runtime.getManifest().version,
    lastUpdate: Date.now(),
});
