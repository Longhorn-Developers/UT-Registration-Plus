import { MessageHandler } from 'chrome-extension-toolkit';
import BrowserActionMessages from 'src/shared/messages/BrowserActionMessages';

const browserActionHandler: MessageHandler<BrowserActionMessages> = {
    disableBrowserAction({ sender, sendResponse }) {
        // by setting the popup to an empty string, clicking the browser action will not open the popup.html.
        // we can then add an onClickListener to it from the content script
        chrome.action.setPopup({ tabId: sender.tab?.id, popup: '' }).then(sendResponse);
    },
    enableBrowserAction({ sender, sendResponse }) {
        chrome.action
            .setPopup({
                tabId: sender.tab?.id,
                popup: 'popup.html',
            })
            .then(sendResponse);
    },
};

export default browserActionHandler;
