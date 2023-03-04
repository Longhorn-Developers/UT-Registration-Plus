import { Serialized } from 'chrome-extension-toolkit';
import { CourseSchedule } from './CourseSchedule';

/**
 * A professor's name, first name, and initial (if applicable)
 * Also includes a link to their RateMyProfessor page
 */
export type Instructor = {
    name: string;
    firstName?: string;
    lastName?: string;
    middleInitial?: string;
    rateMyProfessorURL?: string;
};

/**
 * Whether the class is taught online, in person, or a hybrid of the two
 */
export type InstructionMode = 'Online' | 'In Person' | 'Hybrid';

export type Links = {
    syllabi?: string;
    textbook?: string;
    eCIS?: string;
};

export enum Status {
    OPEN = 'OPEN',
    CLOSED = 'CLOSED',
    WAITLISTED = 'WAITLISTED',
    CANCELLED = 'CANCELLED',
}

export class Course {
    uniqueId: number;
    number: string;
    name: string;
    department: string;
    status: Status;
    instructors: Instructor[];
    isReserved: boolean;
    description: string[];
    schedule: CourseSchedule;
    currentStatus: string;
    url: string;
    links: Links;
    registerURL?: string;
    flags: string[];
    instructionMode: InstructionMode;

    constructor(course: Course | Serialized<Course>) {
        Object.assign(this, course);
    }
}

export type CourseRow = {
    rowElement: HTMLTableRowElement;
    course: Course;
};
