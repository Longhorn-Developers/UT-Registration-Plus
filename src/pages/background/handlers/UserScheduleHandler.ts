import { UserScheduleStore } from '@shared/storage/UserScheduleStore';
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
export type ScheduleHandlerMessageTypes = {
    [K in ScheduleHandlerMessage[keyof ScheduleHandlerMessage]]: Record<string, never>;
};

/**
 * Schedule handler
 */
export class ScheduleHandler {
    constructor(private storage = UserScheduleStore) {}

    public readonly addCourse: MessageHandler<void, void> = async () => {
        console.log('ScheduleHandler addCourse called');
    };

    public readonly removeCourse: MessageHandler<void, void> = async () => {
        console.log('ScheduleHandler removeCourse called');
    };
}
