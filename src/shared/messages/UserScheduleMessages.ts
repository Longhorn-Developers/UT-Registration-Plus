import type { Serialized } from '@chrome-extension-toolkit';
import type { Course } from '@shared/types/Course';
import type { ScheduleChange } from '@shared/util/scheduleHistory';

/**
 * The change that was undone or redone (undefined if there wasn't one), or why it couldn't be
 */
export type ScheduleStepResult = { data: Serialized<ScheduleChange> | undefined } | { error: string };

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
     * Proxies a fetch request through the background script, since content scripts
     * cannot make cross-origin requests directly.
     *
     * @param data - The URL to fetch, HTTP method, optional body, and desired response format.
     * @returns The response body as a string.
     */
    fetchFromUrl: (data: { url: string; method: string; body?: string; response: 'json' | 'text' }) => string;

    /**
     * Remove a course from a schedule
     *
     * @param data - The schedule id and course to remove
     */
    removeCourse: (data: { scheduleId: string; course: Course }) => void;

    /**
     * Undoes the most recent course added to or removed from a schedule
     *
     * @param data - The change to undo, if it has to be that one (like the one a message offers to undo)
     * @returns The change that was undone, or undefined if there was nothing to undo
     */
    undoScheduleChange: (data: { changeId?: string }) => ScheduleStepResult;

    /**
     * Redoes the most recently undone change
     *
     * @param data - The change to redo, if it has to be that one
     * @returns The change that was redone, or undefined if there was nothing to redo
     */
    redoScheduleChange: (data: { changeId?: string }) => ScheduleStepResult;

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
     * Checks whether the user is logged in to the UT Registrar.
     * Opens a login tab if not authenticated.
     *
     * @returns true if the user is logged in, false otherwise
     */
    validateLoginStatus: () => boolean;

    /**
     * Exports the current schedule to a JSON file for backing up and sharing
     *
     * @param data - Id of schedule that will be exported
     * @returns
     */
    exportSchedule: (data: { scheduleId: string }) => string | undefined;
}
