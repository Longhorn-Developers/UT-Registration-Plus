import { Serialized } from 'chrome-extension-toolkit';
import { capitalize } from '../util/string';
import { CourseSchedule } from './CourseSchedule';
import Instructor from './Instructor';

/**
 * Whether the class is taught online, in person, or a hybrid of the two
 */
export type InstructionMode = 'Online' | 'In Person' | 'Hybrid';

/**
 * The status of a course (e.g. open, closed, waitlisted, cancelled)
 */
export enum Status {
    OPEN = 'OPEN',
    CLOSED = 'CLOSED',
    WAITLISTED = 'WAITLISTED',
    CANCELLED = 'CANCELLED',
}

/**
 * Represents a semester, with the year and the season for when a course is offered
 */
export type Semester = {
    /** The year that the semester is in */
    year: number;
    /** The season that the semester is in (Fall, Spring, Summer) */
    season: 'Fall' | 'Spring' | 'Summer';
    /** UT's code for the semester */
    code?: string;
};

/**
 * The internal representation of a course for the extension
 */
export class Course {
    /** Every course has a uniqueId within UT's registrar system corresponding to each course section */
    uniqueId: number;
    /** This is the course number for a course, i.e CS 314 would be 314, MAL 306H would be 306H */
    number: string;
    /** The full name of the course, i.e. CS 314 Data Structures and Algorithms */
    fullName: string;
    /** Just the english name for a course, without the number and department */
    courseName: string;
    /** The unique identifier for which department that a course belongs to, i.e. CS, MAL, etc. */
    department: string;
    /** Is the course open, closed, waitlisted, or cancelled? */
    status: Status;
    /** all the people that are teaching this course, and some metadata about their names */
    instructors: Instructor[];
    /** Some courses at UT are reserved for certain groups of people or people within a certain major, which makes it difficult for people outside of that group to register for the course. */
    isReserved: boolean;
    /** The description of the course as an array of "lines". This will include important information as well as a short summary of the topics covered */
    description?: string[];
    /** The schedule for the course, which includes the days of the week that the course is taught, the time that the course is taught, and the location that the course is taught */
    schedule: CourseSchedule;
    /** the link to the course details page for this course */
    url: string;
    /** the link to the registration page for this course, for easy access when registering */
    registerURL?: string;
    /** At UT, some courses have certain "flags" which aid in graduation */
    flags: string[];
    /** How is the class being taught (online, hybrid, in person, etc) */
    instructionMode: InstructionMode;
    /** Which semester is the course from */
    semester: Semester;

    constructor(course: Serialized<Course> | Course) {
        Object.assign(this, course);
        this.schedule = new CourseSchedule(course.schedule);
        this.instructors = course.instructors.map(i => new Instructor(i));
    }
}

/**
 * A helper type that is used to represent an element in the DOM, with the actual element corresponding to the course object
 */
export type ScrapedRow = {
    element: HTMLTableRowElement;
    course: Course | null;
};
