import type { Course } from '@shared/types/Course';

/**
 * Represents a collection of user schedule messages.
 */
export interface UserScheduleMessages {
    /**
     * Add a course to a schedule
     *
     * @param data - The schedule id and course to add
     */
    addCourse: (data: { scheduleId: string; course: Course; hasColor?: boolean }) => void;

    /**
     * Adds a course by URL
     *
     * @param data - The URL of the course to add
     * @returns Response of the requested course URL
     */
    addCourseByURL: (data: { url: string; method: string; body?: string; response: 'json' | 'text' }) => string;

    /**
     * Remove a course from a schedule
     *
     * @param data - The schedule id and course to remove
     */
    removeCourse: (data: { scheduleId: string; course: Course }) => void;

    /**
     * Clears all courses from a schedule
     *
     * @param data - The id of the schedule to clear
     */
    clearCourses: (data: { scheduleId: string }) => void;

    /**
     * Switches the active schedule to the one specified
     *
     * @param data - The id of the schedule to switch to
     */
    switchSchedule: (data: { scheduleId: string }) => void;

    /**
     * Creates a new schedule with the specified name
     *
     * @param data - The name of the schedule to create
     * @returns Undefined if successful, otherwise an error message
     */
    createSchedule: (data: { scheduleName: string }) => string | undefined;

    /**
     * Deletes a schedule with the specified name
     *
     * @param data - The id of the schedule to delete
     * @returns Undefined if successful, otherwise an error message
     */
    deleteSchedule: (data: { scheduleId: string }) => string | undefined;

    /**
     * Renames a schedule with the specified name
     *
     * @param data - The id of the schedule to rename and the new name
     * @returns Undefined if successful, otherwise an error message
     */
    renameSchedule: (data: { scheduleId: string; newName: string }) => string | undefined;

    /**
     * Checks the login status by making a request to the provided URL.
     *
     * @param data - The URL to check the login status against.
     * @returns true if user was already logged into the provided URL, false otherwise
     */
    validateLoginStatus: (data: { url: string }) => boolean;

    /**
     * Exports the current schedule to a JSON file for backing up and sharing
     *
     * @param data - Id of schedule that will be exported
     * @returns
     */
    exportSchedule: (data: { scheduleId: string }) => string | undefined;
}
