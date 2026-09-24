/**
 * Represents a tab with an additional `id` property
 */
export type TabWithId = Omit<chrome.tabs.Tab, 'id'> & { id: number };

interface OpenNewTabOptions {
    tabIndex?: number;
    windowId?: number;
}

/**
 * This is a helper function that opens a new tab in the current window, and focuses the window
 * @param options - options for which window to open the tab in and where to place it
 * @returns the tab that was opened
 */
export default async function openNewTab(url: string, options: OpenNewTabOptions = {}): Promise<TabWithId> {
    const { tabIndex, windowId } = options;
    const tab = (await chrome.tabs.create({
        url,
        index: tabIndex,
        windowId,
        active: true,
    })) as TabWithId;
    await chrome.windows.update(tab.windowId, { focused: true });
    return tab;
}
