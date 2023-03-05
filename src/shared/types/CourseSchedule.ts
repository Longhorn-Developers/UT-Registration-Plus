import { Serialized } from 'chrome-extension-toolkit';

/**
 * a map of the days of the week that a class is taught, and the corresponding abbreviation
 */
const DAY_MAP = {
    M: 'Monday',
    T: 'Tuesday',
    W: 'Wednesday',
    TH: 'Thursday',
    F: 'Friday',
    S: 'Saturday',
    SU: 'Sunday',
} as const;

/** A day of the week that a class is taught */
type Day = typeof DAY_MAP[keyof typeof DAY_MAP];

/** A physical room that a class is taught in */
type Room = {
    /** The UT building code for where the class is taught */
    building: string;
    /** The room number for where the class is taught */
    number: string;
};

/**
 * This represents one "Meeting Time" for a course, which includes the day of the week that the course is taught, the time that the course is taught, and the location that the course is taught
 */
export type CourseMeeting = {
    /** The day of the week that the course is taught */
    day: Day;
    /** The start time of the course, in minutes since midnight */
    startTime: number;
    /** The end time of the course, in minutes since midnight */
    endTime: number;
    /** The location that the course is taught */
    room?: Room;
};

/**
 * This represents the schedule for a course, which includes all the meeting times for the course, as well as helper functions for parsing, serializing, and deserializing the schedule
 */
export class CourseSchedule {
    meetings: CourseMeeting[];

    constructor(courseSchedule: CourseSchedule | Serialized<CourseSchedule>) {
        Object.assign(this, courseSchedule);
    }

    /**
     * Given a string representation of a schedule, parse it into a CourseSchedule object
     * @param dayLine a string representation of the days of the week that the course is taught: MWF, TR, etc.
     * @param timeLine a string representation of a time-range that the course is taught: 10:00 am - 11:00 am, 1:00 pm - 2:00 pm, etc.
     * @param roomLine a string representation of the room that the course is taught in: JGB 2.302, etc.
     * @returns an array of CourseMeeting objects, which represent the schedule for the course
     */
    static parse(dayLine: string, timeLine: string, roomLine: string): CourseMeeting[] {
        try {
            let days: Day[] = dayLine
                .split('')
                .map((char, i) => {
                    const nextChar = dayLine.charAt(i + 1);
                    let day = char;
                    if (char === 'T' && nextChar === 'H') {
                        day += nextChar;
                    }
                    if (char === 'S' && nextChar === 'U') {
                        day += nextChar;
                    }
                    return DAY_MAP[day];
                })
                .filter(Boolean) as Day[];

            const [startTime, endTime] = timeLine
                .replaceAll('.', '')
                .split('-')
                .map(time => {
                    const [hour, rest] = time.split(':');
                    const [minute, ampm] = rest.split(' ');

                    if (ampm === 'pm') {
                        return Number(hour) * 60 + Number(minute) + 12 * 60;
                    }
                    return Number(hour) * 60 + Number(minute);
                });

            const [building, number] = roomLine.split(' ');

            return days.map(day => ({
                day,
                startTime,
                endTime,
                room: {
                    building,
                    number,
                },
            }));
        } catch (e) {
            throw new Error(`Failed to parse schedule: ${dayLine} ${timeLine} ${roomLine}`);
        }
    }
}
