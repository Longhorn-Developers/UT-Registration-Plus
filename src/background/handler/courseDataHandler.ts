import { MessageHandler } from 'chrome-extension-toolkit';
import CourseDataMessages from 'src/shared/messages/CourseDataMessages';

const courseDataHandler: MessageHandler<CourseDataMessages> = {
    getDistribution({ data, sendResponse }) {
        const { course } = data;

        const dummyData = Array.from({ length: 18 }, () => Math.floor(Math.random() * 100));

        sendResponse(dummyData);
    },
};

export default courseDataHandler;
