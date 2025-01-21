import addCourse from '@pages/background/lib/addCourse';
import clearCourses from '@pages/background/lib/clearCourses';
import createSchedule from '@pages/background/lib/createSchedule';
import deleteSchedule from '@pages/background/lib/deleteSchedule';
import exportSchedule from '@pages/background/lib/exportSchedule';
import removeCourse from '@pages/background/lib/removeCourse';
import renameSchedule from '@pages/background/lib/renameSchedule';
import switchSchedule from '@pages/background/lib/switchSchedule';
import type { UserScheduleMessages } from '@shared/messages/UserScheduleMessages';
import { Course } from '@shared/types/Course';
import { validateLoginStatus } from '@shared/util/checkLoginStatus';
import type { MessageHandler } from 'chrome-extension-toolkit';

const userScheduleHandler: MessageHandler<UserScheduleMessages> = {
    addCourse({ data, sendResponse }) {
        addCourse(data.scheduleId, new Course(data.course), data.hasColor ?? false).then(sendResponse);
    },
    removeCourse({ data, sendResponse }) {
        removeCourse(data.scheduleId, new Course(data.course)).then(sendResponse);
    },
    clearCourses({ data, sendResponse }) {
        clearCourses(data.scheduleId).then(sendResponse);
    },
    switchSchedule({ data, sendResponse }) {
        switchSchedule(data.scheduleId).then(sendResponse);
    },
    createSchedule({ data, sendResponse }) {
        createSchedule(data.scheduleName).then(sendResponse);
    },
    deleteSchedule({ data, sendResponse }) {
        deleteSchedule(data.scheduleId).then(sendResponse);
    },
    renameSchedule({ data, sendResponse }) {
        renameSchedule(data.scheduleId, data.newName).then(sendResponse);
    },
    // proxy so we can add courses
    addCourseByURL({ data: { url, method, body, response }, sendResponse }) {
        fetch(url, {
            method,
            body,
        })
            .then(res => (response === 'json' ? res.json() : res.text()))
            .then(sendResponse);
    },
    validateLoginStatus({ data, sendResponse }) {
        validateLoginStatus(data.url).then(sendResponse);
    },
    exportSchedule({ data, sendResponse }) {
        exportSchedule(data.scheduleId).then(sendResponse);
    },
};

export default userScheduleHandler;
