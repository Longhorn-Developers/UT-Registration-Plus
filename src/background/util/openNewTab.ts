/**
 * This is a helper function that opens a new tab in the current window, and focuses the window
 * @param tabIndex - the index of the tab to open the new tab at (optional)
 * @returns the tab that was opened
 */
export default async function openNewTab(url: string, tabIndex?: number): Promise<chrome.tabs.Tab> {
    const tab = await chrome.tabs.create({ url, index: tabIndex, active: true });
    await chrome.windows.update(tab.windowId, { focused: true });
    return tab;
}
