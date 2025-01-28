import { openNewTab } from './openNewTab';

const CESFall2023Url = 'https://utexas.bluera.com/utexas/rpvl.aspx?rid=d3db767b-049f-46c5-9a67-29c21c29c580&regl=en-US';

interface OpenCESPageData {
    instructorFirstName: string;
    instructorLastName: string;
}

/**
 * Opens the CES page for the specified instructor
 *
 * @param data - Data object containing the first and last name of the instructor
 */
export const openCESPage = (data: OpenCESPageData) => {
    const { instructorFirstName, instructorLastName } = data;

    console.log(`Opening CES page for ${instructorFirstName} ${instructorLastName}`);

    openNewTab({ url: CESFall2023Url }).then(response => {
        const instructorFirstAndLastName = [instructorFirstName, instructorLastName];
        browser.scripting.executeScript({
            target: { tabId: response.tabId },
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
    });
};
