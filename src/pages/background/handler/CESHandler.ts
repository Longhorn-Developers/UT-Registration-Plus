import openNewTab from '@background/util/openNewTab';
import type CESMessage from '@shared/messages/CESMessage';
import type { MessageHandler } from 'chrome-extension-toolkit';

const CESFall2023Url = 'https://utexas.bluera.com/utexas/rpvl.aspx?rid=d3db767b-049f-46c5-9a67-29c21c29c580&regl=en-US';

const CESHandler: MessageHandler<CESMessage> = {
    openCESPage({ data, sendResponse }) {
        const { instructorFirstName, instructorLastName } = data;
        openNewTab(CESFall2023Url).then(tab => {
            const instructorFirstAndLastName = [instructorFirstName, instructorLastName];
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: (...instructorFirstAndLastName: string[]) => {
                    const inputElement = document.getElementById(
                        'ctl00_ContentPlaceHolder1_ViewList_tbxValue'
                    ) as HTMLInputElement | null;
                    const [instructorFirstName, instructorLastName] = instructorFirstAndLastName;
                    if (inputElement) {
                        inputElement.value = `${instructorFirstName} ${instructorLastName}`;
                        inputElement.focus();
                        const enterKeyEvent = new KeyboardEvent('keydown', {
                            key: 'Enter',
                            code: 'Enter',
                            keyCode: 13,
                            which: 13,
                            bubbles: true,
                        });
                        inputElement.dispatchEvent(enterKeyEvent);
                    }
                },
                args: instructorFirstAndLastName,
            });
            sendResponse(tab);
        });
    },
};

export default CESHandler;
