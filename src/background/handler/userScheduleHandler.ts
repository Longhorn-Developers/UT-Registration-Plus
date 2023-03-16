import { MessageHandler } from 'chrome-extension-toolkit';
import { UserScheduleMessages } from 'src/shared/messages/UserScheduleMessages';
import { Course } from 'src/shared/types/Course';
import addCourse from '../lib/addCourse';
import removeCourse from '../lib/removeCourse';

const userScheduleHandler: MessageHandler<UserScheduleMessages> = {
    addCourse({ data, sendResponse }) {
        addCourse(data.scheduleId, new Course(data.course)).then(sendResponse);
    },
    removeCourse({ data, sendResponse }) {
        removeCourse(data.scheduleId, new Course(data.course)).then(sendResponse);
    },
};

export default userScheduleHandler;
