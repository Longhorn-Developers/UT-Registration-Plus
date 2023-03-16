import { Serialized } from 'chrome-extension-toolkit';
import { Course } from './Course';

/**
 * Represents a user's schedule that is stored in the extension
 */
export class UserSchedule {
    courses: Course[];
    id: string;
    name: string;

    constructor(schedule: Serialized<UserSchedule>) {
        this.courses = schedule.courses.map(c => new Course(c));
        this.id = schedule.id;
        this.name = schedule.name;
    }

    containsCourse(course: Course): boolean {
        return this.courses.some(c => c.uniqueId === course.uniqueId);
    }

    getCreditHours(): number {
        return this.courses.reduce((acc, course) => acc + course.creditHours, 0);
    }

    addCourse(course: Course): void {
        if (!this.containsCourse(course)) {
            this.courses.push(course);
        }
    }

    removeCourse(course: Course): void {
        this.courses = this.courses.filter(c => c.uniqueId !== course.uniqueId);
    }
}
