import type { Serialized } from 'chrome-extension-toolkit';

/**
 * a map of the days of the week that a class is taught, and the corresponding abbreviation
 * Don't modify the keys
 */
export const DAY_MAP = {
    M: 'Monday',
    T: 'Tuesday',
    W: 'Wednesday',
    TH: 'Thursday',
    F: 'Friday',
    S: 'Saturday',
    SU: 'Sunday',
} as const;

/** A day of the week that a class is taught */
export type Day = (typeof DAY_MAP)[keyof typeof DAY_MAP];

/** A physical room that a class is taught in */
export type Location = {
    /** The UT building code for where the class is taught */
    building: string;
    /** The room number for where the class is taught */
    room: string;
};

/**
 * This represents one "Meeting Time" for a course, which includes the day of the week that the course is taught, the time that the course is taught, and the location that the course is taught
 */
export class CourseMeeting {
    /** The day of the week that the course is taught */
    days!: Day[];
    /** NOTE: Times starting and after 12 PM have an additional 720 minutes (12 hrs) added to them
     * The start time of the course, in minutes since midnight
     * */
    startTime!: number;
    /** NOTE: Times starting and after 12 PM have an additional 720 minutes (12 hrs) added to them
     * The end time of the course, in minutes since midnight
     * */
    endTime!: number;
    /** The location that the course is taught */
    location?: Location;

    constructor(meeting: Serialized<CourseMeeting>) {
        Object.assign(this, meeting);
    }

    /**
     * Whether or not this meeting conflicts with another meeting
     *
     * @remarks MWF 10:00 am - 11:00 am conflicts with a F 10:00 am - 10:30 am
     * @param meeting - The meeting to check for conflicts with
     * @returns True if the given meeting conflicts with this meeting, false otherwise
     */
    isConflicting({ days: otherDays, startTime: otherStartTime, endTime: otherEndTime }: CourseMeeting): boolean {
        const { days, startTime, endTime } = this;

        const hasDayConflict = days.some(day => otherDays.includes(day));
        const hasTimeConflict = startTime < otherEndTime && endTime > otherStartTime;

        return hasDayConflict && hasTimeConflict;
    }

    /**
     * Return the string representation of the days of the week that this meeting is taught
     *
     * @param options - Options for the string representation
     * @returns String representation of the days of the week that this meeting is taught
     */
    getDaysString({ format, separator }: DaysStringOptions): string {
        let { days } = this;

        if (format === 'short') {
            days = Object.keys(DAY_MAP).filter(day => days.includes(DAY_MAP[day as keyof typeof DAY_MAP])) as Day[];
        }
        if (!separator) {
            return days.join('');
        }
        const listFormat = new Intl.ListFormat('en-US', {
            style: separator,
            type: 'conjunction',
        });
        return listFormat.format(days);
    }

    /**
     * Return the string representation of the time range for the course
     *
     * @param options - Options for the string representation
     * @returns String representation of the time range for the course
     */
    getTimeString({ separator = '-' }: TimeStringOptions): string {
        const { startTime, endTime } = this;
        const startHour = Math.floor(startTime / 60);
        const startMinute = startTime % 60;
        const endHour = Math.floor(endTime / 60);
        const endMinute = endTime % 60;

        let startTimeString = '';
        let endTimeString = '';

        if (startHour === 0) {
            startTimeString = '12';
        } else if (startHour > 12) {
            startTimeString = `${startHour - 12}`;
        } else {
            startTimeString = `${startHour}`;
        }

        startTimeString += startMinute === 0 ? ':00' : `:${startMinute}`;
        startTimeString += startHour >= 12 ? 'pm' : 'am';

        if (endHour === 0) {
            endTimeString = '12';
        } else if (endHour > 12) {
            endTimeString = `${endHour - 12}`;
        } else {
            endTimeString = `${endHour}`;
        }

        endTimeString += endMinute === 0 ? ':00' : `:${endMinute}`;
        endTimeString += endHour >= 12 ? 'pm' : 'am';

        return `${startTimeString} ${separator} ${endTimeString}`;
    }
}

/**
 * Options to control the format of the time string
 */
type TimeStringOptions = {
    /** the separator between the start and end times */
    separator: string;
};

/**
 * Options to control the format of the days string
 */
type DaysStringOptions = {
    /** The format of the days string, short = MWF, long = Monday, Wednesday, Friday */
    format: 'short' | 'long';
    /**
     * The separator between the days
     *
     * 'none' = `MWF`
     *
     * 'conjunction' = `Monday, Wednesday, and Friday`
     *
     * 'disjunction' = `Monday, Wednesday, or Friday`
     *
     * 'narrow' = `Monday Wednesday Friday`
     */
    separator?: Intl.ListFormatStyle;
};
