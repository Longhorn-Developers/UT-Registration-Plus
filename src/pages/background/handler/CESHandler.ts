import { MessageHandler } from 'chrome-extension-toolkit';
import { CESMessage } from 'src/shared/messages/CESMessage';
import openNewTab from '../util/openNewTab';

const CESHandler: MessageHandler<CESMessage> = {
    openCESPage({ data, sendResponse }) {
        const { instructorFirstName, instructorLastName } = data;
        console.log('openCESPage', instructorFirstName, instructorLastName);
        const CESFall2023Url =
            'https://utexas.bluera.com/utexas/rpvl.aspx?rid=d3db767b-049f-46c5-9a67-29c21c29c580&regl=en-US';

        openNewTab(CESFall2023Url).then(sendResponse);
    },
};

export default CESHandler;

// openNewTab(CESFall2023Url).then(tab => {
//     const checkTabUpdatedAndComplete = (tabId: number, changeInfo: chrome.tabs.TabChangeInfo) => {
//         if (tabId === tab.id && changeInfo.status === 'complete') {
//             chrome.tabs.executeScript(
//                 tab.id,
//                 {
//                     code: `
//                     const inputElement = document.getElementById("ctl00_ContentPlaceHolder1_ViewList_tbxValue");
//                     if(inputElement) {
//                         inputElement.value = '${instructorFirstName} ${instructorLastName}';
//                         inputElement.focus();
//                         const enterKeyEvent = new KeyboardEvent('keydown', {key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true});
//                         inputElement.dispatchEvent(enterKeyEvent);
//                     }
//                 `,
//                 },
//                 () => {
//                     if (chrome.runtime.lastError) {
//                         console.error(chrome.runtime.lastError.message);
//                         sendResponse(null);
//                     } else {
//                         sendResponse(tab);
//                     }
//                 }
//             );

//             chrome.tabs.onUpdated.removeListener(checkTabUpdatedAndComplete);
//         }
//     };

//     chrome.tabs.onUpdated.addListener(checkTabUpdatedAndComplete);
// });
//     },
// };

// export default CESHandler;
