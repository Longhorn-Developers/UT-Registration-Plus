import type { Serialized } from '@chrome-extension-toolkit';

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
    /** Unix timestamp of when courses were last checked/refreshed */
    lastCheckedAt?: number | null;
    /** Unix timestamp of the last failed silent refresh attempt — gates a 60s cooldown before retry */
    lastAttemptedAt?: number | null;
    hiddenCourseIds?: number[];

    constructor(schedule: Serialized<UserSchedule>) {
        this.courses = schedule.courses.map(c => new Course(c));
        this.id = schedule.id ?? generateRandomId();
        this.name = schedule.name;
        this.hours = this.courses.reduce((acc, c) => acc + c.creditHours, 0);
        this.updatedAt = schedule.updatedAt ?? 0;
        this.lastCheckedAt = schedule.lastCheckedAt ?? null;
        this.lastAttemptedAt = schedule.lastAttemptedAt ?? null;
        this.hiddenCourseIds = schedule.hiddenCourseIds ?? [];
    }

    containsCourse(course: Course): boolean {
        return this.courses.some(c => c.uniqueId === course.uniqueId);
    }

    isCourseHidden(uniqueId: number): boolean {
        return this.hiddenCourseIds?.includes(uniqueId) ?? false;
    }

    getVisibleCourses(): Course[] {
        return this.courses.filter(c => !this.isCourseHidden(c.uniqueId));
    }

    getVisibleHours(): number {
        return this.getVisibleCourses().reduce((acc, c) => acc + c.creditHours, 0);
    }
}
