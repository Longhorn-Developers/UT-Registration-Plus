import type { TabWithId } from '@background/util/openNewTab';
import openNewTab from '@background/util/openNewTab';
import type { MessageHandler } from '@chrome-extension-toolkit';
import { tabs } from '@shared/messages';
import type { CalendarBackgroundMessages } from '@shared/messages/CalendarMessages';
import { OptionsStore } from '@shared/storage/OptionsStore';
import { CRX_PAGES } from '@shared/types/CRXPages';
import browser from 'webextension-polyfill';

const CALENDAR_TABS_KEY = 'calendarTabs';

type CalendarTabRecord = {
    lastFocusedAt: number;
};

type CalendarTabsState = Record<string, CalendarTabRecord>;

const getCalendarTabsState = async (): Promise<CalendarTabsState> => {
    const storage = await browser.storage.session.get(CALENDAR_TABS_KEY);
    return (storage[CALENDAR_TABS_KEY] as CalendarTabsState | undefined) ?? {};
};

const setCalendarTabRecord = async (tabId: number, record: CalendarTabRecord) => {
    const calendarTabs = await getCalendarTabsState();
    calendarTabs[tabId] = record;
    await browser.storage.session.set({ [CALENDAR_TABS_KEY]: calendarTabs });
};

// Finds every open calendar tab, including ones session storage doesn't know about
// (it's cleared on browser restart and extension update). Records are only used for ranking.
const getTrackedCalendarTabs = async (): Promise<Array<{ record: CalendarTabRecord; tab: TabWithId }>> => {
    const calendarUrl = browser.runtime.getURL(CRX_PAGES.CALENDAR);
    const [calendarTabs, openTabs] = await Promise.all([getCalendarTabsState(), browser.tabs.query({})]);

    return openTabs
        .filter(
            (tab): tab is TabWithId => tab.id !== undefined && !!(tab.pendingUrl || tab.url)?.startsWith(calendarUrl)
        )
        .map(tab => ({ record: calendarTabs[tab.id] ?? { lastFocusedAt: 0 }, tab }));
};

const shouldReuseCalendarTab = async (tab: TabWithId): Promise<boolean> => {
    try {
        const window = await browser.windows.get(tab.windowId);
        return window.state !== 'minimized';
    } catch {
        return false;
    }
};

const getMostRecentlyFocusedCalendarTab = async (): Promise<TabWithId | undefined> => {
    const trackedTabs = await getTrackedCalendarTabs();
    const reusableTabs = (
        await Promise.all(
            trackedTabs.map(async trackedTab => ({
                ...trackedTab,
                isReusable: await shouldReuseCalendarTab(trackedTab.tab),
            }))
        )
    ).filter(trackedTab => trackedTab.isReusable);

    reusableTabs.sort((a, b) => b.record.lastFocusedAt - a.record.lastFocusedAt);
    return reusableTabs[0]?.tab;
};

const openCalendarTab = async (url: string, senderTab?: browser.Tabs.Tab): Promise<TabWithId> => {
    const tab = await openNewTab(url, {
        tabIndex: senderTab?.index !== undefined ? senderTab.index + 1 : undefined,
        windowId: senderTab?.windowId,
    });
    await setCalendarTabRecord(tab.id, { lastFocusedAt: Date.now() });
    return tab;
};

const calendarBackgroundHandler: MessageHandler<CalendarBackgroundMessages> = {
    async registerCalendarTab({ sender, sendResponse }) {
        const tabId = sender.tab?.id;
        if (tabId !== undefined) {
            await setCalendarTabRecord(tabId, { lastFocusedAt: Date.now() });
        }
        sendResponse(undefined);
    },
    async switchToCalendarTab({ data, sender, sendResponse }) {
        const { uniqueId } = data;
        const calendarUrl = browser.runtime.getURL(CRX_PAGES.CALENDAR);
        const trackedCalendarTab = await getMostRecentlyFocusedCalendarTab();

        if (
            trackedCalendarTab !== undefined &&
            !(await OptionsStore.get('alwaysOpenCalendarInNewTab')) &&
            (await shouldReuseCalendarTab(trackedCalendarTab))
        ) {
            const tabid = trackedCalendarTab.id;

            await browser.tabs.update(tabid, { active: true });
            await browser.windows.update(trackedCalendarTab.windowId, {
                focused: true,
                drawAttention: true,
            });
            await setCalendarTabRecord(tabid, { lastFocusedAt: Date.now() });
            if (uniqueId !== undefined) {
                // An unloaded tab (e.g. restored after a restart) isn't ready for messages, so load the course from the URL
                if (trackedCalendarTab.discarded || trackedCalendarTab.status === 'unloaded') {
                    await browser.tabs.update(tabid, { url: `${calendarUrl}?uniqueId=${uniqueId}` });
                } else {
                    await tabs.openCoursePopup({ uniqueId }, { tabId: tabid });
                }
            }

            sendResponse(trackedCalendarTab);
        } else {
            const urlParams = new URLSearchParams();
            if (uniqueId !== undefined) urlParams.set('uniqueId', uniqueId.toString());
            const url = `${calendarUrl}?${urlParams.toString()}`.replace(/\?$/, '');
            const tab = await openCalendarTab(url, sender.tab);

            sendResponse(tab);
        }
    },
};

export default calendarBackgroundHandler;
