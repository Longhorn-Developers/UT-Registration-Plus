import openNewTab from '@background/util/openNewTab';
import { tabs } from '@shared/messages';
import type { CalendarBackgroundMessages } from '@shared/messages/CalendarMessages';
import type { MessageHandler } from 'chrome-extension-toolkit';

const getAllTabInfos = async () => {
    const openTabs = await chrome.tabs.query({});
    console.error('openTabIds', JSON.stringify(openTabs.map(t => t.id)));
    const results = await Promise.allSettled(openTabs.map(tab => tabs.getTabInfo(undefined, tab.id)));
    return results
        .map((result, index) => ({ result, index }))
        .filter(({ result }) => result.status === 'fulfilled')
        .map(({ result, index }) => {
            if (result.status !== 'fulfilled') throw new Error('Will never happen, typescript dumb');
            return {
                ...result.value,
                tab: openTabs[index],
            };
        });
};

const calendarBackgroundHandler: MessageHandler<CalendarBackgroundMessages> = {
    async openCalendarPageIfNotOpen({ data, sendResponse }) {
        const { uniqueId } = data;
        const calendarUrl = chrome.runtime.getURL(`calendar.html`);

        const allTabs = await getAllTabInfos();
        console.error('allTabs', JSON.stringify(allTabs.map(t => ({ url: t.url, id: t.tab.id }))));

        const openCalendarTabInfo = allTabs.find(tab => tab.url.startsWith(calendarUrl));

        if (openCalendarTabInfo !== undefined) {
            chrome.tabs.update(openCalendarTabInfo.tab.id, { active: true });
            if (uniqueId !== undefined) await tabs.openCoursePopup({ uniqueId }, openCalendarTabInfo.tab.id);
            sendResponse(openCalendarTabInfo.tab);
        } else {
            const urlParams = new URLSearchParams();
            if (uniqueId !== undefined) urlParams.set('uniqueId', uniqueId.toString());
            const url = `${calendarUrl}?${urlParams.toString()}`;
            const tab = await openNewTab(url);
            sendResponse(tab);
        }
    },
};

export default calendarBackgroundHandler;
