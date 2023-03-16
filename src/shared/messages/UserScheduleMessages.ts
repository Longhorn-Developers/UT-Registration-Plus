import { Course } from '../types/Course';

export interface UserScheduleMessages {
    addCourse: (data: { scheduleId: string; course: Course }) => void;

    removeCourse: (data: { scheduleId: string; course: Course }) => void;
}
