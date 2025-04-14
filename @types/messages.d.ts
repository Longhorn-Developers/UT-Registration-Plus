import type { Course } from '@shared/types/Course';

/**
 * Base interface for all message types in the extension
 */
export interface ExtensionMessages {
    /**
     * User schedule related messages
     */
    userSchedule: {
        addCourse: (data: { scheduleId: string; course: Course; hasColor?: boolean }) => void;
        addCourseByURL: (data: { url: string; method: string; body?: string; response: 'json' | 'text' }) => string;
        removeCourse: (data: { scheduleId: string; course: Course }) => void;
        clearCourses: (data: { scheduleId: string }) => void;
        switchSchedule: (data: { scheduleId: string }) => void;
        createSchedule: (data: { scheduleName: string }) => string | undefined;
        deleteSchedule: (data: { scheduleId: string }) => string | undefined;
        renameSchedule: (data: { scheduleId: string; newName: string }) => string | undefined;
        validateLoginStatus: (data: { url: string }) => boolean;
        exportSchedule: (data: { scheduleId: string }) => string | undefined;
    };

    /**
     * Browser action related messages
     */
    browserAction?: {
        // Will be populated with actual browser action message types
        [key: string]: (...args: any[]) => any;
    };

    /**
     * Calendar related messages
     */
    calendar?: {
        // Will be populated with actual calendar message types
        [key: string]: (...args: any[]) => any;
    };

    /**
     * Type guard for checking if a message is a valid extension message
     */
    isExtensionMessage: (message: any) => message is keyof ExtensionMessages;
}

/**
 * Utility type for extracting message handler types
 */
export type MessageHandler<T extends keyof ExtensionMessages> = ExtensionMessages[T];
