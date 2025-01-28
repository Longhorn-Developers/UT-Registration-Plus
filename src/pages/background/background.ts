// import type { BACKGROUND_MESSAGES } from '@shared/messages';
// import { UserScheduleStore } from '@shared/storage/UserScheduleStore';
// import updateBadgeText from '@shared/util/updateBadgeText';
// import { MessageListener } from 'chrome-extension-toolkit';
//
// import onInstall from './events/onInstall';
// import onServiceWorkerAlive from './events/onServiceWorkerAlive';
// import onUpdate from './events/onUpdate';
// import browserActionHandler from './handler/browserActionHandler';
// import calendarBackgroundHandler from './handler/calendarBackgroundHandler';
// import CESHandler from './handler/CESHandler';
// import tabManagementHandler from './handler/tabManagementHandler';
// import userScheduleHandler from './handler/userScheduleHandler';
//
// onServiceWorkerAlive();
//
//
// // migration/login logic
// browser.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
//     // console.log(changeInfo);
//     if (changeInfo.url === 'https://utdirect.utexas.edu/apps/registrar/course_schedule/utrp_login/') {
//         function openPopupAction() {
//             browser.tabs.onActivated.removeListener(openPopupAction);
//             browser.action.openPopup();
//         }
//
//         browser.tabs.onActivated.addListener(openPopupAction);
//         await browser.tabs.remove(tabId);
//     }
// });
//
// // initialize the message listener that will listen for messages from the content script
// const messageListener = new MessageListener<BACKGROUND_MESSAGES>({
//     ...browserActionHandler,
//     ...tabManagementHandler,
//     ...userScheduleHandler,
//     ...CESHandler,
//     ...calendarBackgroundHandler,
// });
//
// console.log('background.ts: messageListener:', messageListener);
//
// messageListener.listen();
//
// UserScheduleStore.listen('schedules', async schedules => {
//     const index = await UserScheduleStore.get('activeIndex');
//     const numCourses = schedules.newValue[index]?.courses?.length;
//     updateBadgeText(numCourses || 0);
// });
//
// UserScheduleStore.listen('activeIndex', async ({ newValue }) => {
//     const schedules = await UserScheduleStore.get('schedules');
//     const numCourses = schedules[newValue]?.courses?.length;
//     updateBadgeText(numCourses || 0);
// });
//
// browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     if (message.action === 'openTab') {
//         browser.tabs
//             .create({
//                 url: message.url || 'about:blank',
//                 active: message.active || true,
//             })
//             .then(tab => {
//                 sendResponse({ success: true, tabId: tab.id });
//             })
//             .catch(error => {
//                 sendResponse({ success: false, error: error.message });
//             });
//         return true; // Required for async sendResponse
//     }
// });
import { openDebugTab } from '@shared/util/openDebugTab';
import type { MessageTypes } from 'browser-extension-toolkit';
import { MESSAGE_TYPES, MessagingProxy, tabProxyHandlers } from 'browser-extension-toolkit';

import onInstall from './events/onInstall';
import onUpdate from './events/onUpdate';
import {
    SCHEDULE_HANDLER_MESSAGE_TYPES,
    ScheduleHandler,
    type ScheduleHandlerMessageTypes,
} from './handlers/UserScheduleHandler';

/**
 * Unified message types for the background script
 */
export type UnifiedMessageTypes = MessageTypes & ScheduleHandlerMessageTypes;

export const UNIFIED_MESSAGE_TYPES = {
    ...MESSAGE_TYPES,
    ...SCHEDULE_HANDLER_MESSAGE_TYPES,
};

/**
 * will be triggered on either install or update
 * (will also be triggered on a user's sync'd browsers (on other devices)))
 */
// browser.runtime.onInstalled.addListener(details => {
//     switch (details.reason) {
//         case 'install':
//             onInstall();
//             break;
//         case 'update':
//             onUpdate();
//             break;
//         default:
//             break;
//     }
// });

const backgroundProxy = new MessagingProxy<UnifiedMessageTypes>('background');

console.log('background.ts loaded');

// Register handlers
backgroundProxy.registerProxyHandler(UNIFIED_MESSAGE_TYPES.TAB.OPEN, tabProxyHandlers.openTab);

// BUG: Doesn't open right away
// openDebugTab();

const scheduleHandler = new ScheduleHandler();
const scheduleMessageToHandler: Record<keyof typeof UNIFIED_MESSAGE_TYPES.SCHEDULE, unknown> = {
    ADD_COURSE: scheduleHandler.addCourse,
    REMOVE_COURSE: scheduleHandler.removeCourse,
};

// Register all schedule handlers at once
Object.entries(UNIFIED_MESSAGE_TYPES.SCHEDULE).forEach(([key, type]) => {
    // @ts-ignore
    backgroundProxy.registerProxyHandler(type, scheduleMessageToHandler[key]);
    // @ts-ignore
    console.log('Registered handler for', type, scheduleMessageToHandler[key]);
});
