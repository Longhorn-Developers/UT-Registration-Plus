import type { TabWithId } from '@background/util/openNewTab';
import openNewTab from '@background/util/openNewTab';
import { tabs } from '@shared/messages';
import type { CalendarBackgroundMessages } from '@shared/messages/CalendarMessages';
import type { MessageHandler } from 'chrome-extension-toolkit';

const getAllTabInfos = async () => {
    const openTabs = (await chrome.tabs.query({})).filter((tab): tab is TabWithId => tab.id !== undefined);
    const results = await Promise.allSettled(openTabs.map(tab => tabs.getTabInfo(undefined, tab.id)));

    type TabInfo = PromiseFulfilledResult<Awaited<ReturnType<typeof tabs.getTabInfo>>>;
    return results
        .map((result, index) => ({ result, index }))
        .filter((el): el is { result: TabInfo; index: number } => el.result.status === 'fulfilled')
        .map(({ result, index }) => ({
            ...result.value,
            tab: openTabs[index]!,
        }));
};

const calendarBackgroundHandler: MessageHandler<CalendarBackgroundMessages> = {
    async switchToCalendarTab({ data, sendResponse }) {
        const { uniqueId } = data;
        const calendarUrl = chrome.runtime.getURL(`calendar.html`);

        const allTabs = await getAllTabInfos();

        const openCalendarTabInfo = allTabs.find(tab => tab.url?.startsWith(calendarUrl));

        if (openCalendarTabInfo !== undefined) {
            const tabid = openCalendarTabInfo.tab.id;

            await chrome.tabs.update(tabid, { active: true });
            await chrome.windows.update(openCalendarTabInfo.tab.windowId, { focused: true, drawAttention: true });
            if (uniqueId !== undefined) await tabs.openCoursePopup({ uniqueId }, tabid);

            sendResponse(openCalendarTabInfo.tab);
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
