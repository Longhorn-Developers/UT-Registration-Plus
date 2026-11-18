/**
 * Messages for managing the user's open tabs list
 */
export default interface TabManagementMessages {
    /**
     * Opens a new tab with the given URL
     *
     * @param data - The URL to open
     */
    openNewTab: (data: { url: string }) => chrome.tabs.Tab;

    /**
     * Switches to the settings page if it's open in a tab, or opens it in a new tab next to the current one
     *
     * @returns The settings page's tab
     */
    switchToSettingsTab: () => chrome.tabs.Tab;

    /**
     * Gets the ID of the current tab (the tab that sent the message)
     *
     * @returns The ID of the current tab
     */
    getTabId: () => number;

    /**
     * Removes the tab with the given ID
     *
     * @param data - The ID of the tab to remove
     * @returns The ID of the tab that was removed
     */
    removeTab: (data: { tabId: number }) => void;
}
