import { Course } from '../types/Course';

export interface UserScheduleMessages {
    /**
     * Add a course to a schedule
     * @param data the schedule name and course to add
     */
    addCourse: (data: { scheduleName: string; course: Course }) => void;
    /**
     * Remove a course from a schedule
     * @param data the schedule name and course to remove
     */
    removeCourse: (data: { scheduleName: string; course: Course }) => void;
    /**
     * Clears all courses from a schedule
     * @param data the name of the schedule to clear
     */
    clearCourses: (data: { scheduleName: string }) => void;

    /**
     * Switches the active schedule to the one specified
     * @param data the name of the schedule to switch to
     */
    switchSchedule: (data: { scheduleName: string }) => void;

    /**
     * Creates a new schedule with the specified name
     * @param data the name of the schedule to create
     * @returns undefined if successful, otherwise an error message
     */
    createSchedule: (data: { scheduleName: string }) => string | undefined;
    /**
     * Deletes a schedule with the specified name
     * @param data the name of the schedule to delete
     * @returns undefined if successful, otherwise an error message
     */
    deleteSchedule: (data: { scheduleName: string }) => string | undefined;
    /**
     * Renames a schedule with the specified name
     * @param data the name of the schedule to rename and the new name
     * @returns undefined if successful, otherwise an error message
     */
    renameSchedule: (data: { scheduleName: string; newName: string }) => string | undefined;
}
