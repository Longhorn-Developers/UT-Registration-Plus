import { createLocalStore } from 'chrome-extension-toolkit';

/**
 * A store that is used to store data that is only relevant during development
 */
interface IDevStore {
    /** whether the user is a developer */
    isDeveloper: boolean;
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

export const DevStore = createLocalStore<IDevStore>('devStore', {
    isDeveloper: false,
    debugTabId: undefined,
    isTabReloading: true,
    wasDebugTabVisible: false,
    isExtensionReloading: true,
    reloadTabId: undefined,
});
