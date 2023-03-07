import { MessageHandler } from 'chrome-extension-toolkit';
import TabManagementMessages from 'src/shared/messages/TabManagementMessages';
import openNewTab from '../util/openNewTab';

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
