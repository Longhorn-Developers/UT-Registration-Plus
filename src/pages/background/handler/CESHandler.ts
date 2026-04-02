import openNewTab from '@background/util/openNewTab';
import type { MessageHandler } from '@chrome-extension-toolkit';
import type CESMessage from '@shared/messages/CESMessage';

const CESFall2025Url =
    'https://my-utexas-bc.bluera.com/rpvlf.aspx?rid=2837da9d-d4e9-48a8-8af0-ecdc103dc254&regl=en-US&haslang=true';

const CESHandler: MessageHandler<CESMessage> = {
    async openCESPage({ data, sendResponse }) {
        const { instructorFirstName, instructorLastName } = data;
        const tab = await openNewTab(CESFall2025Url);
        const instructorFirstAndLastName = [instructorFirstName, instructorLastName];
        await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: (...instructorFirstAndLastName: string[]) => {
                const inputElement = document.querySelector('input[type=text]') as HTMLInputElement | null;
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
    },
};

export default CESHandler;
