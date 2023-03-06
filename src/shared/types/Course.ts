import { Serialized } from 'chrome-extension-toolkit';
import { CourseSchedule } from './CourseSchedule';

/**
 * A professor's name, first name, and initial (if applicable)
 * Also includes a link to their RateMyProfessor page
 */
export type Instructor = {
    fullName: string;
    firstName?: string;
    lastName?: string;
    middleInitial?: string;
};

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
    season: string;
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

    constructor(course: Course | Serialized<Course>) {
        Object.assign(this, course);
    }

    /**
     * Get a string representation of the instructors for this course
     * @param options - the options for how to format the instructor string
     * @returns
     */
    getInstructorString(options: InstructorFormatOptions): string {
        const { max = 3, format, prefix = '' } = options;
        if (!this.instructors.length) {
            return `${prefix} Undecided`;
        }

        const instructors = this.instructors.slice(0, max);
        switch (format) {
            case 'abbr':
                return (
                    prefix +
                    instructors
                        .map(instructor => {
                            let firstInitial = instructor.firstName?.[0];
                            if (firstInitial) {
                                firstInitial += '. ';
                            }
                            return `${firstInitial}${instructor.lastName}`;
                        })
                        .join(', ')
                );
            case 'full_name':
                return prefix + instructors.map(instructor => instructor.fullName).join(', ');
            case 'first_last':
                return (
                    prefix + instructors.map(instructor => `${instructor.firstName} ${instructor.lastName}`).join(', ')
                );
            case 'last':
                return prefix + instructors.map(instructor => instructor.lastName).join(', ');
            default:
                throw new Error(`Invalid Instructor String format: ${format}`);
        }
    }
}

/**
 * A helper type that is used to represent an element in the DOM, with the actual element corresponding to the course object
 */
export type ScrapedRow = {
    element: HTMLTableRowElement;
    course: Course | null;
};

/**
 * Options for how to format the instructor string
 */
type InstructorFormatOptions = {
    /** a prefix to add to the string, ex: "with" Mike Scott */
    prefix?: string;
    /** The maximum number of instructors to show */
    max?: number;
    /** How do you want the names of the professors formatted */
    format: 'abbr' | 'first_last' | 'last' | 'full_name';
};
