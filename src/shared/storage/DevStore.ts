import { ExtensionStorage } from 'browser-extension-toolkit';

type ExtensionStorageData = {
    [key: string]: unknown;
};

/**
 * A store that is used to store data that is only relevant during development
 */
export interface IDevStore extends ExtensionStorageData {
    /** the tabId for the debug tab */
    debugTabId?: number;
    /** whether the debug tab is visible */
    wasDebugTabVisible?: boolean;
    /** whether we should enable extension reloading */
    isExtensionReloading?: boolean;
    /** whether we should enable tab reloading */
    isTabReloading?: boolean;
    /** The id of the tab that we want to reload (after the extension reloads itself ) */
    reloadTabId?: number;
}

export const DevStore = new ExtensionStorage<IDevStore>({
    area: 'local',
    serialize: true,

    // Storage namespace isolation
    // prefix: 'devStore',
});

DevStore.bulkSet({
    debugTabId: undefined,
    isTabReloading: true,
    wasDebugTabVisible: false,
    isExtensionReloading: true,
    reloadTabId: undefined,
});
