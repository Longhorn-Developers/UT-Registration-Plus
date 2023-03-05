import { Serialized } from 'chrome-extension-toolkit';

const dayMap = {
    M: 'Monday',
    T: 'Tuesday',
    W: 'Wednesday',
    TH: 'Thursday',
    F: 'Friday',
    S: 'Saturday',
    SU: 'Sunday',
} as const;

type Day = typeof dayMap[keyof typeof dayMap];

type Room = {
    building: string;
    number: string;
};

export type CourseSection = {
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

    static parse(dayLine: string, timeLine: string, roomLine: string): CourseSection[] {
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
                    return dayMap[day];
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
