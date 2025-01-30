import { UserScheduleStore } from '@shared/storage/UserScheduleStore';
import type { Course } from '@shared/types/Course';
import { getUnusedColor } from '@shared/util/colors';
import type { MessageHandler } from 'browser-extension-toolkit';

interface ScheduleHandlerMessage {
    readonly ADD_COURSE: 'schedule:course:add';
    readonly REMOVE_COURSE: 'schedule:course:remove';
}

export const SCHEDULE_HANDLER_MESSAGE_TYPES = {
    SCHEDULE: {
        ADD_COURSE: 'schedule:course:add',
        REMOVE_COURSE: 'schedule:course:remove',
    } satisfies ScheduleHandlerMessage,
};

// eslint-disable-next-line jsdoc/require-jsdoc
export interface IAddCourse {
    scheduleId: string;
    course: Course;
    hasColor?: boolean;
}

// eslint-disable-next-line jsdoc/require-jsdoc
export type ScheduleHandlerMessageTypes = {
    [K in ScheduleHandlerMessage[keyof ScheduleHandlerMessage]]: IAddCourse;
};

/**
 * Schedule handler
 */
export class ScheduleHandler {
    constructor(private storage = UserScheduleStore) {}

    public readonly addCourse: MessageHandler<IAddCourse, void> = async data => {
        console.log('ScheduleHandler addCourse called');
        const { scheduleId, course, hasColor } = data;

        const schedules = await UserScheduleStore.get('schedules');
        console.log('schedules', schedules);

        const activeSchedule = schedules.find(s => s.id === scheduleId);
        if (!activeSchedule) {
            throw new Error('Schedule not found');
        }

        if (!hasColor) {
            course.colors = getUnusedColor(activeSchedule, course);
        }

        activeSchedule.courses.push(course);
        console.log('activeSchedule', activeSchedule);

        activeSchedule.updatedAt = Date.now();
        await UserScheduleStore.set('schedules', schedules);
        console.log(`Course added: ${course.courseName} (ID: ${course.uniqueId})`);

        const newSchedules = await UserScheduleStore.get('schedules');
        console.log('newSchedules', newSchedules);
    };

    public readonly removeCourse: MessageHandler<void, void> = async () => {
        console.log('ScheduleHandler removeCourse called');
    };
}
