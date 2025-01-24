import type { BACKGROUND_MESSAGES } from '@shared/messages';
import { UserScheduleStore } from '@shared/storage/UserScheduleStore';
import updateBadgeText from '@shared/util/updateBadgeText';
import { MessageListener } from 'chrome-extension-toolkit';

import onInstall from './events/onInstall';
import onServiceWorkerAlive from './events/onServiceWorkerAlive';
import onUpdate from './events/onUpdate';
import browserActionHandler from './handler/browserActionHandler';
import calendarBackgroundHandler from './handler/calendarBackgroundHandler';
import CESHandler from './handler/CESHandler';
import tabManagementHandler from './handler/tabManagementHandler';
import userScheduleHandler from './handler/userScheduleHandler';

onServiceWorkerAlive();

/**
 * will be triggered on either install or update
 * (will also be triggered on a user's sync'd browsers (on other devices)))
 */
browser.runtime.onInstalled.addListener(details => {
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

// migration/login logic
browser.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
    // console.log(changeInfo);
    if (changeInfo.url === 'https://utdirect.utexas.edu/apps/registrar/course_schedule/utrp_login/') {
        function openPopupAction() {
            browser.tabs.onActivated.removeListener(openPopupAction);
            browser.action.openPopup();
        }

        browser.tabs.onActivated.addListener(openPopupAction);
        await browser.tabs.remove(tabId);
    }
});

// initialize the message listener that will listen for messages from the content script
const messageListener = new MessageListener<BACKGROUND_MESSAGES>({
    ...browserActionHandler,
    ...tabManagementHandler,
    ...userScheduleHandler,
    ...CESHandler,
    ...calendarBackgroundHandler,
});

console.log('background.ts: messageListener:', messageListener);

messageListener.listen();

UserScheduleStore.listen('schedules', async schedules => {
    const index = await UserScheduleStore.get('activeIndex');
    const numCourses = schedules.newValue[index]?.courses?.length;
    updateBadgeText(numCourses || 0);
});

UserScheduleStore.listen('activeIndex', async ({ newValue }) => {
    const schedules = await UserScheduleStore.get('schedules');
    const numCourses = schedules[newValue]?.courses?.length;
    updateBadgeText(numCourses || 0);
});

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'openTab') {
        browser.tabs
            .create({
                url: message.url || 'about:blank',
                active: message.active || true,
            })
            .then(tab => {
                sendResponse({ success: true, tabId: tab.id });
            })
            .catch(error => {
                sendResponse({ success: false, error: error.message });
            });
        return true; // Required for async sendResponse
    }
});
