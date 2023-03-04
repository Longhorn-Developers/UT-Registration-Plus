import { Serialized } from 'chrome-extension-toolkit';

type CourseSchedule = {};

type Professor = {
    name: string;
    firstName?: string;
    initial?: string;
};

type InstructionMode = 'Online' | 'In Person' | 'Hybrid';

type Links = {
    syllabi?: string;
    textbook?: string;
    rateMyProfessor?: string;
    eCIS?: string;
};

export class Course {
    uniqueId: number;
    number: string;
    name: string;
    department: string;
    professor: Professor;
    description?: string;
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
