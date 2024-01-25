import { UserScheduleMessages } from '@shared/messages/UserScheduleMessages';
import { Course } from '@shared/types/Course';
import { MessageHandler } from 'chrome-extension-toolkit';
import addCourse from '../lib/addCourse';
import clearCourses from '../lib/clearCourses';
import createSchedule from '../lib/createSchedule';
import deleteSchedule from '../lib/deleteSchedule';
import removeCourse from '../lib/removeCourse';
import renameSchedule from '../lib/renameSchedule';
import switchSchedule from '../lib/switchSchedule';

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
