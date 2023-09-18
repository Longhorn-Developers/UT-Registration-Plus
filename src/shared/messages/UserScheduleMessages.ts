import { Course } from '../types/Course';

export interface UserScheduleMessages {
    addCourse: (data: { scheduleName: string; course: Course }) => void;

    removeCourse: (data: { scheduleName: string; course: Course }) => void;
}
