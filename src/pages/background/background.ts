import { BACKGROUND_MESSAGES } from '@src/shared/messages';
import { sessionStore } from '@src/shared/storage/SessionStore';
import { generateRandomId } from '@src/shared/util/random';
import { MessageListener } from 'chrome-extension-toolkit';
import onInstall from './events/onInstall';
import onNewChromeSession from './events/onNewChromeSession';
import onServiceWorkerAlive from './events/onServiceWorkerAlive';
import onUpdate from './events/onUpdate';
import browserActionHandler from './handler/browserActionHandler';
import tabManagementHandler from './handler/tabManagementHandler';
import userScheduleHandler from './handler/userScheduleHandler';

onServiceWorkerAlive();

/**
 * will be triggered on either install or update
 * (will also be triggered on a user's sync'd browsers (on other devices)))
 */
chrome.runtime.onInstalled.addListener(details => {
    switch (details.reason) {
        case 'install':
            onInstall();
            break;
        case 'update':
            onUpdate();
            break;
        default:
            break;
    }
});

// initialize the message listener that will listen for messages from the content script
const messageListener = new MessageListener<BACKGROUND_MESSAGES>({
    ...browserActionHandler,
    ...tabManagementHandler,
    ...userScheduleHandler,
});

messageListener.listen();

sessionStore.get('chromeSessionId').then(async chromeSessionId => {
    if (!chromeSessionId) {
        await sessionStore.set('chromeSessionId', generateRandomId(10));
        onNewChromeSession();
    }
});

console.log('background script loaded');
