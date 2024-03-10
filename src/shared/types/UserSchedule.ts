import type { Serialized } from 'chrome-extension-toolkit';

import { Course } from './Course';

/**
 * Represents a user's schedule that is stored in the extension
 */
export class UserSchedule {
    courses: Course[];
    name: string;
    hours: number;

    constructor(schedule: Serialized<UserSchedule>) {
        this.courses = schedule.courses.map(c => new Course(c));
        this.name = schedule.name;
        this.hours = 0;
        for (const course of this.courses && this.courses.length > 0) {
            this.hours += course.creditHours;
        }
    }

    containsCourse(course: Course): boolean {
        return this.courses.some(c => c.uniqueId === course.uniqueId);
    }
}
