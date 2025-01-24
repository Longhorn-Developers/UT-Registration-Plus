/**
 * Represents a tab with an additional `id` property
 */
export type TabWithId = Omit<browser.tabs.Tab, 'id'> & { id: number };

/**
 * This is a helper function that opens a new tab in the current window, and focuses the window
 * @param tabIndex - the index of the tab to open the new tab at (optional)
 * @returns the tab that was opened
 */
export default async function openNewTab(url: string, tabIndex?: number): Promise<TabWithId> {
    const tab = (await browser.tabs.create({ url, index: tabIndex, active: true })) as TabWithId;

    console.log('Opened new tab:', tab);

    if (tab.windowId !== undefined) {
        await browser.windows.update(tab.windowId, { focused: true });
    }

    return tab;
}
