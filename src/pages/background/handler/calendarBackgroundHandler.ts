import type { TabWithId } from '@background/util/openNewTab';
import openNewTab from '@background/util/openNewTab';
import type { MessageHandler } from '@chrome-extension-toolkit';
import { tabs } from '@shared/messages';
import type { CalendarBackgroundMessages } from '@shared/messages/CalendarMessages';
import { OptionsStore } from '@shared/storage/OptionsStore';
import { CRX_PAGES } from '@shared/types/CRXPages';

const CALENDAR_TABS_KEY = 'calendarTabs';

type CalendarTabRecord = {
    lastFocusedAt: number;
    /** When the extension opened the tab, until its calendar registers */
    openedAt?: number;
};

/**
 * How long a tab the extension just opened counts as the calendar before its page has loaded
 */
const OPENING_CALENDAR_TAB_MS = 5000;

type CalendarTabsState = Record<string, CalendarTabRecord>;

const getCalendarTabsState = async (): Promise<CalendarTabsState> => {
    const storage = await chrome.storage.session.get(CALENDAR_TABS_KEY);
    return (storage[CALENDAR_TABS_KEY] as CalendarTabsState | undefined) ?? {};
};

// Serialized, since a reloading calendar unregisters and registers its tab at about the same time
let calendarTabsChanges: Promise<unknown> = Promise.resolve();

const changeCalendarTabsState = (change: (calendarTabs: CalendarTabsState) => void): Promise<void> => {
    const next = calendarTabsChanges.then(async () => {
        const calendarTabs = await getCalendarTabsState();
        change(calendarTabs);
        await chrome.storage.session.set({ [CALENDAR_TABS_KEY]: calendarTabs });
    });
    calendarTabsChanges = next.catch(() => undefined);
    return next;
};

const setCalendarTabRecord = (tabId: number, record: CalendarTabRecord) =>
    changeCalendarTabsState(calendarTabs => {
        calendarTabs[tabId] = record;
    });

const removeCalendarTabRecord = (tabId: number) =>
    changeCalendarTabsState(calendarTabs => {
        delete calendarTabs[tabId];
    });

/**
 * Finds the tabs showing the calendar. Tabs don't expose their URLs without the "tabs" permission, but the
 * extension's contexts do.
 */
const getCalendarTabIds = async (): Promise<Set<number>> => {
    const calendarUrl = chrome.runtime.getURL(CRX_PAGES.CALENDAR);
    try {
        const contexts = await chrome.runtime.getContexts({ contextTypes: [chrome.runtime.ContextType.TAB] });
        return new Set(
            contexts
                .filter(context => context.documentUrl?.split(/[?#]/)[0] === calendarUrl)
                .map(context => context.tabId)
        );
    } catch (error) {
        console.error('Failed to look for open calendar pages', error);
        return new Set();
    }
};

type TrackedCalendarTab = {
    record: CalendarTabRecord;
    tab: TabWithId;
    /** Whether the calendar in the tab has loaded, so it can take messages */
    isLoaded: boolean;
};

const getTrackedCalendarTabs = async (): Promise<TrackedCalendarTab[]> => {
    const calendarTabIds = await getCalendarTabIds();
    const calendarTabs = await getCalendarTabsState();
    const trackedEntries = Object.entries(calendarTabs);
    const validatedTabs = await Promise.all(
        trackedEntries.map(async ([tabId, record]) => {
            const numericTabId = Number(tabId);
            try {
                const tab = await chrome.tabs.get(numericTabId);
                // Discarded tabs and ones still opening have no calendar page to check, so they're kept
                const isLoaded = calendarTabIds.has(numericTabId);
                const isOpening =
                    record.openedAt !== undefined && Date.now() - record.openedAt < OPENING_CALENDAR_TAB_MS;
                if (tab.id === undefined || !(isLoaded || tab.discarded || isOpening)) {
                    await removeCalendarTabRecord(numericTabId);
                    return undefined;
                }

                return {
                    record,
                    tab: tab as TabWithId,
                    isLoaded,
                };
            } catch {
                await removeCalendarTabRecord(numericTabId);
                return undefined;
            }
        })
    );

    return validatedTabs.filter(tab => tab !== undefined);
};

const shouldReuseCalendarTab = async (tab: TabWithId): Promise<boolean> => {
    try {
        const window = await chrome.windows.get(tab.windowId);
        return window.state !== 'minimized';
    } catch {
        return false;
    }
};

const getMostRecentlyFocusedCalendarTab = async (): Promise<TrackedCalendarTab | undefined> => {
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
    return reusableTabs[0];
};

const openCalendarTab = async (url: string, senderTab?: chrome.tabs.Tab): Promise<TabWithId> => {
    const tab = await openNewTab(url, {
        tabIndex: senderTab?.index !== undefined ? senderTab.index + 1 : undefined,
        windowId: senderTab?.windowId,
    });
    await setCalendarTabRecord(tab.id, { lastFocusedAt: Date.now(), openedAt: Date.now() });
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
    async unregisterCalendarTab({ sender, sendResponse }) {
        const tabId = sender.tab?.id;
        if (tabId !== undefined) {
            await removeCalendarTabRecord(tabId);
        }
        sendResponse(undefined);
    },
    async switchToCalendarTab({ data, sender, sendResponse }) {
        const { uniqueId } = data;
        const calendarUrl = chrome.runtime.getURL(CRX_PAGES.CALENDAR);
        const tracked = await getMostRecentlyFocusedCalendarTab();
        const trackedCalendarTab = tracked?.tab;

        if (
            trackedCalendarTab !== undefined &&
            !(await OptionsStore.get('alwaysOpenCalendarInNewTab')) &&
            (await shouldReuseCalendarTab(trackedCalendarTab))
        ) {
            const tabid = trackedCalendarTab.id;

            await chrome.tabs.update(tabid, { active: true });
            await chrome.windows.update(trackedCalendarTab.windowId, {
                focused: true,
                drawAttention: true,
            });
            if (uniqueId === undefined) {
                await setCalendarTabRecord(tabid, { lastFocusedAt: Date.now() });
            } else if (tracked?.isLoaded) {
                await setCalendarTabRecord(tabid, { lastFocusedAt: Date.now() });
                await tabs.openCoursePopup({ uniqueId }, { tabId: tabid });
            } else {
                // It can't take the message yet, so load the calendar with the course instead
                await chrome.tabs.update(tabid, { url: `${calendarUrl}?uniqueId=${uniqueId}` });
                await setCalendarTabRecord(tabid, { lastFocusedAt: Date.now(), openedAt: Date.now() });
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
