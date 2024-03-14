import type { Serialized } from 'chrome-extension-toolkit';
import { v4 as uuid, v4 } from 'uuid';

import { Course } from './Course';

/**
 * Represents a user's schedule that is stored in the extension
 */
export class UserSchedule {
    courses: Course[];
    name: string;
    hours: number;
    /** Unix timestamp of when the schedule was last updated */
    updatedAt: number;
    /** UUID for comparison and ID purposes */
    id: string;

    constructor(schedule: Serialized<UserSchedule>) {
        this.courses = schedule.courses.map(c => new Course(c));
        this.name = schedule.name;
        this.hours = 0;
        for (const course of this.courses) {
            this.hours += course.creditHours;
        }
        this.updatedAt = schedule.updatedAt;
        this.id = this.generateID();
    }

    containsCourse(course: Course): boolean {
        return this.courses.some(c => c.uniqueId === course.uniqueId);
    }

    generateID(): string {
        return uuid();
    }
}
