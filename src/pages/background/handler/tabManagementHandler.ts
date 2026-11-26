import type { MessageHandler } from '@chrome-extension-toolkit';
import type { TabWithId } from '@pages/background/util/openNewTab';
import openNewTab from '@pages/background/util/openNewTab';
import type TabManagementMessages from '@shared/messages/TabManagementMessages';
import { CRX_PAGES } from '@shared/types/CRXPages';
import browser from 'webextension-polyfill';

/**
 * Finds a tab showing one of the extension's own pages, preferring one in the given window
 *
 * @param pageUrl - the page's full URL, without a query or hash
 * @param windowId - the window to look in first
 * @returns the tab and window the page is open in, or undefined if it isn't open
 */
export async function findExtensionPageTab(
    pageUrl: string,
    windowId?: number
): Promise<{ tabId: number; windowId: number } | undefined> {
    // Firefox doesn't expose Chrome's extension-context API.
    if (typeof chrome.runtime.getContexts !== 'function') {
        const tabs = await browser.tabs.query({});
        const pageTabs = tabs.filter(
            (tab): tab is TabWithId =>
                tab.id !== undefined && tab.windowId !== undefined && tab.url?.split(/[?#]/)[0] === pageUrl
        );
        const tab = pageTabs.find(tab => tab.windowId === windowId) ?? pageTabs[0];
        return tab && { tabId: tab.id, windowId: tab.windowId };
    }

    // Without the "tabs" permission, tabs don't expose their URLs, but the extension's contexts do
    const contexts = await chrome.runtime.getContexts({ contextTypes: [chrome.runtime.ContextType.TAB] });
    const pageTabs = contexts.filter(context => {
        const url = context.documentUrl?.split(/[?#]/)[0];
        return url === pageUrl && context.tabId !== -1;
    });
    const tab = pageTabs.find(context => context.windowId === windowId) ?? pageTabs[0];
    return tab && { tabId: tab.tabId, windowId: tab.windowId };
}

const tabManagementHandler: MessageHandler<TabManagementMessages> = {
    getTabId({ sendResponse, sender }) {
        sendResponse(sender.tab?.id ?? -1);
    },
    openNewTab({ data, sender, sendResponse }) {
        const { url } = data;
        const nextIndex = sender.tab?.index !== undefined ? sender.tab.index + 1 : undefined;
        openNewTab(url, {
            tabIndex: nextIndex,
            windowId: sender.tab?.windowId,
        }).then(sendResponse);
    },
    async switchToSettingsTab({ sender, sendResponse }) {
        const settingsUrl = browser.runtime.getURL(CRX_PAGES.OPTIONS);
        // The popup has no tab, so use the last focused window
        const windowId = sender.tab?.windowId ?? (await browser.windows.getLastFocused().catch(() => undefined))?.id;
        const openTab = await findExtensionPageTab(settingsUrl, windowId).catch(error => {
            console.error('Failed to look for an open settings page', error);
            return undefined;
        });

        const tab = openTab && (await browser.tabs.update(openTab.tabId, { active: true }).catch(() => undefined));
        if (tab?.windowId !== undefined) {
            await browser.windows.update(tab.windowId, { focused: true }).catch(() => undefined);
            sendResponse(tab);
            return;
        }

        const nextIndex = sender.tab?.index !== undefined ? sender.tab.index + 1 : undefined;
        sendResponse(await openNewTab(settingsUrl, { tabIndex: nextIndex, windowId: sender.tab?.windowId }));
    },
    removeTab({ data, sendResponse }) {
        const { tabId } = data;
        browser.tabs.remove(tabId).then(sendResponse);
    },
};

export default tabManagementHandler;
