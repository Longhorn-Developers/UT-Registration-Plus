import { MessageListener, setTraceContextProvider, setTraceHandler } from '@chrome-extension-toolkit';
import { captureException, continueTrace, getTraceData, init, startSpan } from '@sentry/react';
import type { BACKGROUND_MESSAGES } from '@shared/messages';
import { SENTRY_OPTIONS } from '@shared/sentry';
import { UserScheduleStore } from '@shared/storage/UserScheduleStore';
import { UTRP_LOGIN_URL } from '@shared/util/appUrls';
import updateBadgeText from '@shared/util/updateBadgeText';

init(SENTRY_OPTIONS);

// In dev, inject Referer header on Sentry toolbar iframe requests so Sentry
// returns the correct frame-ancestors CSP (Chrome strips Referer from
// chrome-extension:// pages on cross-origin iframe navigations).
if (import.meta.env.DEV) {
    // Sentry toolbar: set Referer so backend accepts the request, then inject
    // a content script into the iframe to fix document.referrer so postMessage
    // uses the real extension origin instead of the fake localhost one.
    chrome.declarativeNetRequest.updateSessionRules({
        removeRuleIds: [1],
        addRules: [
            {
                id: 1,
                condition: { urlFilter: '||sentry.io/toolbar/', resourceTypes: ['sub_frame'] },
                action: {
                    type: 'modifyHeaders',
                    requestHeaders: [{ header: 'Referer', operation: 'set', value: 'http://localhost:80' }],
                    responseHeaders: [
                        { header: 'Content-Security-Policy', operation: 'remove' },
                        { header: 'X-Frame-Options', operation: 'remove' },
                    ],
                },
            },
        ],
    });

    chrome.scripting
        .registerContentScripts([
            {
                id: 'sentry-toolbar-referrer-fix',
                matches: ['*://*.sentry.io/toolbar/*'],
                allFrames: true,
                runAt: 'document_start',
                world: 'MAIN',
                js: ['sentry-toolbar-referrer-fix.js'],
            },
        ])
        .catch(() => {
            // Already registered from a previous SW activation
        });
}

setTraceContextProvider(() => {
    const data = getTraceData();
    return { trace: data['sentry-trace'], baggage: data.baggage };
});

setTraceHandler(({ trace, baggage, name }, fn) => {
    const run = () =>
        startSpan({ name: `message:${name}`, op: 'message.handle', attributes: { 'message.name': name } }, fn);

    if (trace) {
        continueTrace({ sentryTrace: trace, baggage }, run);
    } else {
        run();
    }
});

import onInstall from './events/onInstall';
import onServiceWorkerAlive from './events/onServiceWorkerAlive';
import onUpdate from './events/onUpdate';
import browserActionHandler from './handler/browserActionHandler';
import CESHandler from './handler/CESHandler';
import calendarBackgroundHandler from './handler/calendarBackgroundHandler';
import gitHubStatsHandler from './handler/gitHubStatsHandler';
import tabManagementHandler from './handler/tabManagementHandler';
import userScheduleHandler from './handler/userScheduleHandler';

onServiceWorkerAlive();

chrome.tabs.onRemoved.addListener(async tabId => {
    const storage = await chrome.storage.session.get('calendarTabs');
    const calendarTabs = (storage.calendarTabs as Record<string, unknown> | undefined) ?? {};
    if (String(tabId) in calendarTabs) {
        delete calendarTabs[String(tabId)];
        await chrome.storage.session.set({ calendarTabs });
    }
});

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

// migration/login logic
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
    // console.log(changeInfo);
    if (changeInfo.url === UTRP_LOGIN_URL) {
        function openPopupAction() {
            chrome.tabs.onActivated.removeListener(openPopupAction);
            chrome.action.openPopup();
        }

        chrome.tabs.onActivated.addListener(openPopupAction);
        await chrome.tabs.remove(tabId);
    }
});

// initialize the message listener that will listen for messages from the content script
const messageListener = new MessageListener<BACKGROUND_MESSAGES>({
    ...browserActionHandler,
    ...tabManagementHandler,
    ...userScheduleHandler,
    ...CESHandler,
    ...calendarBackgroundHandler,
    ...gitHubStatsHandler,
});

messageListener.listen({ onError: error => captureException(error) });

UserScheduleStore.subscribe('schedules', async schedules => {
    const index = await UserScheduleStore.get('activeIndex');
    const numCourses = schedules.newValue[index]?.courses?.length;
    updateBadgeText(numCourses || 0);
});

UserScheduleStore.subscribe('activeIndex', async ({ newValue }) => {
    const schedules = await UserScheduleStore.get('schedules');
    const numCourses = schedules[newValue]?.courses?.length;
    updateBadgeText(numCourses || 0);
});
