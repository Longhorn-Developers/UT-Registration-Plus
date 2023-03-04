import { Serialized } from 'chrome-extension-toolkit';

type CourseSchedule = {};

export class Course {
    id: number;
    name: string;
    professor: string;
    schedule: CourseSchedule;
    currentStatus: string;
    url: string;
    registerURL?: string;

    constructor(course: Course | Serialized<Course>) {
        Object.assign(this, course);
    }
}
