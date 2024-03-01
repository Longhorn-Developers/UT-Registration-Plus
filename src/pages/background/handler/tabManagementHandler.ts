import openNewTab from '@pages/background/util/openNewTab';
import type TabManagementMessages from '@shared/messages/TabManagementMessages';
import type { MessageHandler } from 'chrome-extension-toolkit';

const tabManagementHandler: MessageHandler<TabManagementMessages> = {
    getTabId({ sendResponse, sender }) {
        sendResponse(sender.tab?.id ?? -1);
    },
    openNewTab({ data, sender, sendResponse }) {
        const { url } = data;
        const nextIndex = sender.tab?.index ? sender.tab.index + 1 : undefined;
        openNewTab(url, nextIndex).then(sendResponse);
    },
    removeTab({ data, sendResponse }) {
        const { tabId } = data;
        chrome.tabs.remove(tabId).then(sendResponse);
    },
};

export default tabManagementHandler;
