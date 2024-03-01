import type { Serialized } from 'chrome-extension-toolkit';

import { Course } from './Course';

/**
 * Represents a user's schedule that is stored in the extension
 */
export class UserSchedule {
    courses: Course[];
    name: string;
    hours: number;

    constructor(schedule: Serialized<UserSchedule>);
    constructor(courses: Course[], name: string, hours: number);
    constructor(coursesOrSchedule: Course[] | Serialized<UserSchedule>, name?: string, hours?: number) {
        if (Array.isArray(coursesOrSchedule)) {
            this.courses = coursesOrSchedule;
            this.name = name || '';
            this.hours = hours || 0;
        } else {
            this.courses = coursesOrSchedule.courses.map(c => new Course(c));
            this.name = coursesOrSchedule.name;
            this.hours = 0;
            for (const course of this.courses) {
                this.hours += course.creditHours;
            }
        }
    }

    containsCourse(course: Course): boolean {
        return this.courses.some(c => c.uniqueId === course.uniqueId);
    }
}
