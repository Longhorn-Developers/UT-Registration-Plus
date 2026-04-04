import openNewTab from '@background/util/openNewTab';
import type { MessageHandler } from '@chrome-extension-toolkit';
import { tabs } from '@shared/messages';
import type { CalendarBackgroundMessages } from '@shared/messages/CalendarMessages';
import { OptionsStore } from '@shared/storage/OptionsStore';
import { CRX_PAGES } from '@shared/types/CRXPages';
import browser from 'webextension-polyfill';

const getAllTabInfos = async () => {
    const openTabs = (await browser.tabs.query({})).filter(
        (tab): tab is browser.Tabs.Tab & { id: number } => tab.id !== undefined
    );
    const results = await Promise.allSettled(openTabs.map(tab => tabs.getTabInfo({ tabId: tab.id })));
    type TabInfo = PromiseFulfilledResult<Awaited<ReturnType<typeof tabs.getTabInfo>>>;
    return results
        .map((result, index) => ({ result, index }))
        .filter((el): el is { result: TabInfo; index: number } => el.result.status === 'fulfilled')
        .map(({ result, index }) => ({
            ...result.value,
            // biome-ignore lint/style/noNonNullAssertion: We've already checked for edge cases
            tab: openTabs[index]!,
        }));
};

const calendarBackgroundHandler: MessageHandler<CalendarBackgroundMessages> = {
    async switchToCalendarTab({ data, sendResponse }) {
        const { uniqueId } = data;
        const calendarUrl = chrome.runtime.getURL(CRX_PAGES.CALENDAR);

        const allTabs = await getAllTabInfos();

        const openCalendarTabInfo = allTabs.find(tab => tab.tab.url?.startsWith(calendarUrl));

        if (openCalendarTabInfo !== undefined && !(await OptionsStore.get('alwaysOpenCalendarInNewTab'))) {
            const { tab } = openCalendarTabInfo;
            const { id: tabId, windowId, discarded, autoDiscardable, groupId } = tab;

            if (
                windowId === undefined ||
                discarded === undefined ||
                autoDiscardable === undefined ||
                groupId === undefined
            ) {
                throw new Error('Calendar tab is missing required properties');
            }

            await chrome.tabs.update(tabId, { active: true });
            await chrome.windows.update(windowId, { focused: true, drawAttention: true });
            if (uniqueId !== undefined) await tabs.openCoursePopup({ uniqueId }, { tabId });
            sendResponse({ ...tab, windowId, discarded, autoDiscardable, groupId });
        } else {
            const urlParams = new URLSearchParams();
            if (uniqueId !== undefined) urlParams.set('uniqueId', uniqueId.toString());
            const url = `${calendarUrl}?${urlParams.toString()}`.replace(/\?$/, '');
            const tab = await openNewTab(url);
            sendResponse(tab);
        }
    },
};

export default calendarBackgroundHandler;
