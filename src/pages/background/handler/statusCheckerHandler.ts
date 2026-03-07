import type { MessageHandler } from '@chrome-extension-toolkit';
import refreshCourses from '@pages/background/lib/refreshCourses';
import type { StatusCheckerBackgroundMessages } from '@shared/messages/StatusCheckerMessages';

const statusCheckerHandler: MessageHandler<StatusCheckerBackgroundMessages> = {
    refreshCourses({ sendResponse }) {
        refreshCourses().then(sendResponse);
    },
};

export default statusCheckerHandler;
