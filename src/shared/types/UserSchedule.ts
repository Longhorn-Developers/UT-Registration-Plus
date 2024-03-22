import type { Serialized } from 'chrome-extension-toolkit';

import { generateRandomId } from '../util/random';
import { Course } from './Course';

/**
 * Represents a user's schedule that is stored in the extension
 */
export class UserSchedule {
    courses: Course[];
    id: string;
    name: string;
    hours: number;
    /** Unix timestamp of when the schedule was last updated */
    updatedAt: number;

    constructor(schedule: Serialized<UserSchedule>) {
        this.courses = schedule.courses.map(c => new Course(c));
        this.id = schedule.id ?? generateRandomId();
        this.name = schedule.name;
        this.hours = this.courses.reduce((acc, c) => acc + c.creditHours, 0);
        this.updatedAt = schedule.updatedAt ?? 0;
    }

    containsCourse(course: Course): boolean {
        return this.courses.some(c => c.uniqueId === course.uniqueId);
    }
}
