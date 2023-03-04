import { Serialized } from 'chrome-extension-toolkit';

type Day = 'M' | 'T' | 'W' | 'TH' | 'F' | 'S' | 'SU';

type Room = {
    building: string;
    number: string;
};

type CourseSection = {
    day: Day;
    startTime: number;
    endTime: number;
    room?: Room;
};

export class CourseSchedule {
    sections: CourseSection[];

    constructor(courseSchedule: CourseSchedule | Serialized<CourseSchedule>) {
        Object.assign(this, courseSchedule);
    }

    static parse(days: Day[] , times, hours): CourseSchedule {}

    toString(): string {
        return '';
    }
}
