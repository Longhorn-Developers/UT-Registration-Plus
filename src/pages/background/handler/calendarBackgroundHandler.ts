import openNewTab from '@background/util/openNewTab';
import { tabs } from '@shared/messages';
import type { CalendarBackgroundMessages } from '@shared/messages/CalendarMessages';
import type { MessageHandler } from 'chrome-extension-toolkit';

const getAllTabInfos = async () => {
    const openTabs = await chrome.tabs.query({});
    const results = await Promise.allSettled(
        openTabs.map(tab => {
            if (tab.id === undefined) throw new Error('tab.id is undefined');
            return tabs.getTabInfo(undefined, tab.id);
        })
    );
    return results
        .map((result, index) => ({ result, index }))
        .filter(({ result }) => result.status === 'fulfilled')
        .map(({ result, index }) => ({
            ...(result.status === 'fulfilled' ? result.value : {}),
            tab: openTabs[index],
        }));
};

const calendarBackgroundHandler: MessageHandler<CalendarBackgroundMessages> = {
    async switchToCalendarTab({ data, sendResponse }) {
        const { uniqueId } = data;
        const calendarUrl = chrome.runtime.getURL(`calendar.html`);

        const allTabs = await getAllTabInfos();

        const openCalendarTabInfo = allTabs.find(tab => tab.url?.startsWith(calendarUrl));

        if (openCalendarTabInfo !== undefined) {
            if (openCalendarTabInfo.tab === undefined) throw new Error('openCalendarTabInfo.tab is undefined');

            const tabid: number | undefined = openCalendarTabInfo.tab.id;
            if (tabid === undefined) throw new Error('openCalendarTabInfo.tab?.id is undefined');

            chrome.tabs.update(tabid, { active: true });
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
