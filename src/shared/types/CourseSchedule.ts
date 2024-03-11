import type { Serialized } from 'chrome-extension-toolkit';

import type { Day } from './CourseMeeting';
import { CourseMeeting, DAY_MAP } from './CourseMeeting';

/**
 * This represents the schedule for a course, which includes all the meeting times for the course, as well as helper functions for parsing, serializing, and deserializing the schedule
 */
export class CourseSchedule {
    meetings: CourseMeeting[];

    constructor(courseSchedule?: Serialized<CourseSchedule>) {
        if (!courseSchedule || courseSchedule.meetings === undefined) {
            this.meetings = [];
            return;
        }

        this.meetings = courseSchedule.meetings.map(meeting => new CourseMeeting(meeting));
    }

    /**
     * Given a string representation of the meeting information for a class, parse it into a CourseMeeting object
     * @param dayLine a string representation of the days of the week that the course is taught: MWF, TR, etc.
     * @param timeLine a string representation of a time-range that the course is taught: 10:00 am - 11:00 am, 1:00 pm - 2:00 pm, etc.
     * @param locLine a string representation of the location that the course is taught in: JGB 2.302, etc.
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

            const location = locLine.split(' ').filter(Boolean);

            return new CourseMeeting({
                days,
                startTime,
                endTime,
                location: location.length
                    ? {
                          building: location[0],
                          room: location[1],
                      }
                    : undefined,
            });
        } catch (e) {
            throw new Error(`Failed to parse schedule: ${dayLine} ${timeLine} ${locLine}`);
        }
    }
}
