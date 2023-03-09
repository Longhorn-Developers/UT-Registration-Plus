import { MessageListener } from 'chrome-extension-toolkit';
import { BACKGROUND_MESSAGES } from 'src/shared/messages';
import { generateRandomId } from 'src/shared/util/random';
import onInstall from './events/onInstall';
import onNewChromeSession from './events/onNewChromeSession';
import onServiceWorkerAlive from './events/onServiceWorkerAlive';
import onUpdate from './events/onUpdate';
import { SessionStore } from './storage/SessionStore';
import browserActionHandler from './handler/browserActionHandler';
import hotReloadingHandler from './handler/hotReloadingHandler';
import tabManagementHandler from './handler/tabManagementHandler';

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
    ...hotReloadingHandler,
    ...tabManagementHandler,
});

messageListener.listen();

SessionStore.getChromeSessionId().then(async chromeSessionId => {
    if (!chromeSessionId) {
        await SessionStore.setChromeSessionId(generateRandomId(10));
        onNewChromeSession();
    }
});
