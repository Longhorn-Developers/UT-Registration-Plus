import type { StatsMessages } from '@shared/messages/StatsMessages';
import { StatsStore } from '@shared/storage/StatsStore';
import type { MessageHandler } from 'chrome-extension-toolkit';

let previousInteractionTimeMinutes = 0;

const statsHandler: MessageHandler<StatsMessages> = {
    async interactedWithScheduling({ sendResponse }) {
        const currentTimeMinutes = Math.floor(Date.now() / 1000 / 60);

        // Only update the minutesScheduling stat if it's a new minute
        if (currentTimeMinutes > previousInteractionTimeMinutes) {
            previousInteractionTimeMinutes = currentTimeMinutes;
            const minutesScheduling = await StatsStore.get('minutesScheduling');
            await StatsStore.set('minutesScheduling', minutesScheduling + 1);
        }
        sendResponse();
    },
    async openedCourseDetails({ sendResponse }) {
        const timesOpenedCourseDetails = await StatsStore.get('timesOpenedCourseDetails');
        await StatsStore.set('timesOpenedCourseDetails', timesOpenedCourseDetails + 1);
        sendResponse();
    },
    // async openedCalendar({ sendResponse }) {
    //     const timesOpenedCalendar = await StatsStore.get('timesOpenedCalendar');
    //     await StatsStore.set('timesOpenedCalendar', timesOpenedCalendar + 1);
    //     sendResponse();
    // },
    async infiniteScrolled({ sendResponse }) {
        const timesInfiniteScrolled = await StatsStore.get('timesInfiniteScrolled');
        await StatsStore.set('timesInfiniteScrolled', timesInfiniteScrolled + 1);
        sendResponse();
    },
};

export default statsHandler;
