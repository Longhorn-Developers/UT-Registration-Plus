import { createMessenger } from 'chrome-extension-toolkit';

type MyMessages = {
    openNewTab: {
        data: { url: string };
    };
};

const messenger = createMessenger<MyMessages>('background');

/**
 *  Content scripts and background scripts are isolated environments.
 *  Content scripts are where our code interacting with the webpage lives,
 *  whereas the background script is where we can open a tab from.
 *  This function allows us to open a new tab from the content script by communicating
 *  with the background script.
 */
export async function openTabFromContentScript(url: string) {
    //  @ts-ignore
    messenger
        .openNewTab({ url })
        .then(() => {
            console.log('New tab opened with URL:', url);
        })
        .catch(error => {
            console.error('Error opening new tab:', error);
        });
}
