import { MessageHandler } from 'chrome-extension-toolkit';
import TabManagementMessages from 'src/shared/messages/TabManagementMessages';

const tabManagementHandler: MessageHandler<TabManagementMessages> = {
    getTabId({ sendResponse, sender }) {
        sendResponse(sender.tab?.id ?? -1);
    },
    openNewTab({ data, sendResponse }) {
        const { url } = data;
        chrome.tabs.create({ url }).then(sendResponse);
    },
    removeTab({ data, sendResponse }) {
        const { tabId } = data;
        chrome.tabs.remove(tabId).then(sendResponse);
    },
};

export default tabManagementHandler;
