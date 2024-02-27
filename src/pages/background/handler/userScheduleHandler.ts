import type { UserScheduleMessages } from '@shared/messages/UserScheduleMessages';
import { Course } from '@shared/types/Course';
import type { MessageHandler } from 'chrome-extension-toolkit';

import addCourse from '@pages/background/lib/addCourse';
import clearCourses from '@pages/background/lib/clearCourses';
import createSchedule from '@pages/background/lib/createSchedule';
import deleteSchedule from '@pages/background/lib/deleteSchedule';
import removeCourse from '@pages/background/lib/removeCourse';
import renameSchedule from '@pages/background/lib/renameSchedule';
import switchSchedule from '@pages/background/lib/switchSchedule';

const userScheduleHandler: MessageHandler<UserScheduleMessages> = {
    addCourse({ data, sendResponse }) {
        addCourse(data.scheduleName, new Course(data.course)).then(sendResponse);
    },
    removeCourse({ data, sendResponse }) {
        removeCourse(data.scheduleName, new Course(data.course)).then(sendResponse);
    },
    clearCourses({ data, sendResponse }) {
        clearCourses(data.scheduleName).then(sendResponse);
    },
    switchSchedule({ data, sendResponse }) {
        switchSchedule(data.scheduleName).then(sendResponse);
    },
    createSchedule({ data, sendResponse }) {
        createSchedule(data.scheduleName).then(sendResponse);
    },
    deleteSchedule({ data, sendResponse }) {
        deleteSchedule(data.scheduleName).then(sendResponse);
    },
    renameSchedule({ data, sendResponse }) {
        renameSchedule(data.scheduleName, data.newName).then(sendResponse);
    },
};

export default userScheduleHandler;
