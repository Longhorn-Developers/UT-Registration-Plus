import type { MessageHandler } from '@chrome-extension-toolkit';
import refreshCourseStatuses from '@pages/background/lib/refreshCourseStatuses';
import type { StatusCheckerBackgroundMessages } from '@shared/messages/StatusCheckerMessages';
import { StatusCheckerStore } from '@shared/storage/StatusCheckerStore';

const statusCheckerHandler: MessageHandler<StatusCheckerBackgroundMessages> = {
    refreshCourseStatuses({ sendResponse }) {
        refreshCourseStatuses().then(sendResponse);
    },
    getLastCheckedAt({ sendResponse }) {
        StatusCheckerStore.get('lastCheckedAt').then(sendResponse);
    },
};

export default statusCheckerHandler;
