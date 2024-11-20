import type { Serialized } from 'chrome-extension-toolkit';

import type { Day } from './CourseMeeting';
import { CourseMeeting, DAY_MAP } from './CourseMeeting';

/**
 * This represents the schedule for a course, which includes all the meeting times for the course, as well as helper functions for parsing, serializing, and deserializing the schedule
 */
export class CourseSchedule {
    meetings: CourseMeeting[] = [];

    constructor(courseSchedule?: Serialized<CourseSchedule>) {
        if (!courseSchedule || courseSchedule.meetings === undefined) {
            this.meetings = [];
            return;
        }

        this.meetings = courseSchedule.meetings.map(meeting => new CourseMeeting(meeting));
    }

    /**
     * Given a string representation of the meeting information for a class, parse it into a CourseMeeting object
     *
     * @param dayLine - A string representation of the days of the week that the course is taught: MWF, TR, etc.
     * @param timeLine - A string representation of a time-range that the course is taught: 10:00 am - 11:00 am, 1:00 pm - 2:00 pm, etc.
     * @param locLine - A string representation of the location that the course is taught in: JGB 2.302, etc.
     * @returns CourseMeeting object representing the meeting information
     */
    static parse(dayLine: string, timeLine: string, locLine: string): CourseMeeting {
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
                    return DAY_MAP[day as keyof typeof DAY_MAP];
                })
                .filter(Boolean) as Day[];

            const [startTime, endTime] = timeLine
                .replaceAll('.', '')
                .split('-')
                .map(time => {
                    const [rawHour, rest] = time.split(':');
                    const [rawMinute, ampm] = rest?.split(' ') ?? ['', ''];
                    const hour = (rawHour === '12' ? 0 : Number(rawHour)) + (ampm === 'pm' ? 12 : 0);
                    const minute = Number(rawMinute);

                    return hour * 60 + minute;
                });

            const location = locLine.split(' ').filter(Boolean);

            if (startTime === undefined || endTime === undefined) {
                throw new Error('Failed to parse time');
            }

            if (startTime >= endTime) {
                throw new Error('Start time must be before end time');
            }

            if (location === undefined) {
                throw new Error('Failed to parse location');
            }

            return new CourseMeeting({
                days,
                startTime,
                endTime,
                location: location[0]
                    ? {
                          building: location[0],
                          room: location[1] ?? '',
                      }
                    : undefined,
            } satisfies Serialized<CourseMeeting>);
        } catch (e) {
            throw new Error(`Failed to parse schedule: ${dayLine} ${timeLine} ${locLine}`);
        }
    }
}
