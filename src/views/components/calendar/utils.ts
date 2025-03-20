import { tz } from '@date-fns/tz';
import { UserScheduleStore } from '@shared/storage/UserScheduleStore';
import type { Course } from '@shared/types/Course';
import type { CourseMeeting } from '@shared/types/CourseMeeting';
import Instructor from '@shared/types/Instructor';
import type { UserSchedule } from '@shared/types/UserSchedule';
import { downloadBlob } from '@shared/util/downloadBlob';
import type { Serialized } from 'chrome-extension-toolkit';
import type { DateArg, Day } from 'date-fns';
import {
    addDays,
    eachDayOfInterval,
    format as formatDate,
    formatISO,
    getDay,
    nextDay,
    parseISO,
    set as setMultiple,
    toDate,
} from 'date-fns';
import { toBlob } from 'html-to-image';

import { academicCalendars } from './academic-calendars';

// Do all timezone calculations relative to UT's timezone
const TIMEZONE_ID = 'America/Chicago';
const TZ = tz(TIMEZONE_ID);

// Datetime format used by iCal, not directly supported by date-fns
// (date-fns adds the timezone to the end, but iCal doesn't want it)
const ISO_BASIC_DATETIME_FORMAT = "yyyyMMdd'T'HHmmss";

// iCal uses two-letter codes for days of the week
export const CAL_MAP = {
    Sunday: 'SU',
    Monday: 'MO',
    Tuesday: 'TU',
    Wednesday: 'WE',
    Thursday: 'TH',
    Friday: 'FR',
    Saturday: 'SA',
} as const satisfies Record<string, string>;

// Date objects' day field goes by index like this
const DAY_NAME_TO_NUMBER = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
} as const satisfies Record<string, number>;

/**
 * Retrieves the schedule from the UserScheduleStore based on the active index.
 * @returns A promise that resolves to the retrieved schedule.
 */
const getSchedule = async (): Promise<Serialized<UserSchedule> | undefined> => {
    const schedules = await UserScheduleStore.get('schedules');
    const activeIndex = await UserScheduleStore.get('activeIndex');
    const schedule = schedules[activeIndex];

    return schedule;
};

/**
 * Formats the given number of minutes into a string representation of HHMMSS format.
 *
 * @param minutes - The number of minutes to format.
 * @returns A string representation of the given minutes in HHMMSS format.
 */
export const formatToHHMMSS = (minutes: number) => {
    const hours = String(Math.floor(minutes / 60)).padStart(2, '0');
    const mins = String(minutes % 60).padStart(2, '0');
    return `${hours}${mins}00`;
};

/**
 * Formats a date in the format YYYYMMDD'T'HHmmss, which is the format used by iCal.
 *
 * @param date - The date to format.
 * @returns The formatted date string.
 */
const iCalDateFormat = <DateType extends Date>(date: DateArg<DateType>) =>
    formatDate(date, ISO_BASIC_DATETIME_FORMAT, { in: TZ });

/**
 * Returns the next day of the given date, inclusive of the given day.
 *
 * If the given date is the given day, the same date is returned.
 *
 * For example, a Monday targeting a Wednesday will return the next Wednesday,
 * but if it was targeting a Monday it would return the same date.
 *
 * @param date - The date to increment.
 * @param day - The day to increment to. (0 = Sunday, 1 = Monday, etc.)
 * @returns The next day of the given date, inclusive of the given day.
 */
export const nextDayInclusive = <DateType extends Date, ResultDate extends Date = DateType>(
    date: DateArg<DateType>,
    day: Day
): ResultDate => {
    if (getDay(date) === day) {
        return toDate(date);
    }

    return nextDay(date, day);
};

/**
 *  Stringifies a list of items in English format.
 *
 * @param items - The list of items to stringify.
 * @returns A string representation of the list in English format.
 * @example
 * englishStringifyList([]) // ''
 * englishStringifyList(['Alice']) // 'Alice'
 * englishStringifyList(['Alice', 'Bob']) // 'Alice and Bob'
 * englishStringifyList(['Alice', 'Bob', 'Charlie']) // 'Alice, Bob, and Charlie'
 */
export const englishStringifyList = (items: readonly string[]): string => {
    if (items.length === 0) return '';
    if (items.length === 1) return items[0]!;
    if (items.length === 2) return `${items[0]} and ${items[1]}`;

    return `${items.slice(0, -1).join(', ')}, and ${items.at(-1)}`;
};

/**
 * Returns an array of all the dates (as Date objects) in the given date ranges.
 *
 * @param dateRanges - An array of date ranges.
 * Each date range can be a string (in which case it is interpreted as a single date)
 * or an array of two strings (in which case it is interpreted as a date range, inclusive).
 * @returns An array of all the dates (as Date objects) in the given date ranges.
 *
 * @example
 * allDatesInRanges(['2025-01-01', ['2025-03-14', '2025-03-16']]) // ['2025-01-01', '2025-03-14', '2025-03-15', '2025-03-16'] (as Date objects)
 *
 * @remarks Does not remove duplicate dates.
 */
export const allDatesInRanges = (dateRanges: readonly (string | [string, string])[]): Date[] =>
    dateRanges.flatMap(breakDate => {
        if (Array.isArray(breakDate)) {
            return eachDayOfInterval({
                start: parseISO(breakDate[0], { in: TZ }),
                end: parseISO(breakDate[1], { in: TZ }),
            });
        }

        return parseISO(breakDate, { in: TZ });
    });

/**
 * Creates a VEVENT string for a meeting of a course.
 *
 * @param course - The course object
 * @param meeting - The meeting object
 * @returns A string representation of the meeting in the iCalendar format (ICS)
 */
export const meetingToIcsString = (course: Serialized<Course>, meeting: Serialized<CourseMeeting>): string | null => {
    const { startTime, endTime, days, location } = meeting;
    if (!course.semester.code) {
        console.error(`No semester found for course uniqueId: ${course.uniqueId}`);
        return null;
    }

    if (days.length === 0) {
        console.error(`No days found for course uniqueId: ${course.uniqueId}`);
        return null;
    }

    if (!Object.prototype.hasOwnProperty.call(academicCalendars, course.semester.code)) {
        console.error(
            `No academic calendar found for semester code: ${course.semester.code}; course uniqueId: ${course.uniqueId}`
        );
        return null;
    }
    const academicCalendar = academicCalendars[course.semester.code as keyof typeof academicCalendars];

    const startDate = nextDayInclusive(
        parseISO(academicCalendar.firstClassDate, { in: TZ }),
        DAY_NAME_TO_NUMBER[days[0]!]
    );

    const startTimeHours = Math.floor(startTime / 60);
    const startTimeMinutes = startTime % 60;
    const startTimeDate = setMultiple(startDate, { hours: startTimeHours, minutes: startTimeMinutes }, { in: TZ });

    const endTimeHours = Math.floor(endTime / 60);
    const endTimeMinutes = endTime % 60;
    const endTimeDate = setMultiple(startDate, { hours: endTimeHours, minutes: endTimeMinutes }, { in: TZ });

    const untilDate = addDays(parseISO(academicCalendar.lastClassDate, { in: TZ }), 1);

    const daysNumSet = new Set(days.map(d => DAY_NAME_TO_NUMBER[d]));
    const excludedDates = allDatesInRanges(academicCalendar.breakDates)
        // Don't need to exclude Tues/Thurs if it's a MWF class, etc.
        .filter(date => daysNumSet.has(getDay(date, { in: TZ }) as Day))
        .map(date => setMultiple(date, { hours: startTimeHours, minutes: startTimeMinutes }, { in: TZ }));

    const startDateFormatted = iCalDateFormat(startTimeDate);
    const endDateFormatted = iCalDateFormat(endTimeDate);
    // Convert days to ICS compatible format, e.g. MO,WE,FR
    const icsDays = days.map(day => CAL_MAP[day]).join(',');

    // per spec, UNTIL must be in UTC
    const untilDateFormatted = formatISO(untilDate, { format: 'basic', in: tz('utc') });
    const excludedDatesFormatted = excludedDates.map(date => iCalDateFormat(date));

    const uniqueNumberFormatted = course.uniqueId.toString().padStart(5, '0');

    // The list part of "Taught by Michael Scott and Siddhartha Chatterjee Beasley"
    const instructorsFormatted = englishStringifyList(
        course.instructors
            .map(instructor => Instructor.prototype.toString.call(instructor, { format: 'first_last' }))
            .filter(name => name !== '')
    );

    // Construct event string
    let icsString = 'BEGIN:VEVENT\n';
    icsString += `DTSTART;TZID=${TIMEZONE_ID}:${startDateFormatted}\n`;
    icsString += `DTEND;TZID=${TIMEZONE_ID}:${endDateFormatted}\n`;
    icsString += `RRULE:FREQ=WEEKLY;BYDAY=${icsDays};UNTIL=${untilDateFormatted}\n`;
    icsString += `EXDATE;TZID=${TIMEZONE_ID}:${excludedDatesFormatted.join(',')}\n`;
    icsString += `SUMMARY:${course.fullName}\n`;

    if (location?.building || location?.building) {
        const locationFormatted = `${location?.building ?? ''} ${location?.room ?? ''}`.trim();
        icsString += `LOCATION:${locationFormatted}\n`;
    }

    icsString += `DESCRIPTION:Unique number: ${uniqueNumberFormatted}`;
    if (instructorsFormatted) {
        // Newlines need to be double-escaped
        icsString += `\\nTaught by ${instructorsFormatted}`;
    }
    icsString += '\n';

    icsString += 'END:VEVENT';

    return icsString;
};

/**
 * Creates a VCALENDAR string for a schedule of a user.
 * @param schedule - The schedule object
 * @returns A string representation of the schedule in the iCalendar format (ICS)
 */
export const scheduleToIcsString = (schedule: Serialized<UserSchedule>) => {
    let icsString = 'BEGIN:VCALENDAR\nVERSION:2.0\nCALSCALE:GREGORIAN\nX-WR-CALNAME:My Schedule\n';

    const vevents = schedule.courses
        .flatMap(course => course.schedule.meetings.map(meeting => meetingToIcsString(course, meeting)))
        .filter(event => event !== null)
        .join('\n');

    if (vevents.length > 0) {
        icsString += `${vevents}\n`;
    }

    icsString += 'END:VCALENDAR';

    return icsString;
};

/**
 * Saves the current schedule as a calendar file in the iCalendar format (ICS).
 * Fetches the current active schedule and converts it into an ICS string.
 * Downloads the ICS file to the user's device.
 */
export const saveAsCal = async () => {
    const schedule = await getSchedule();

    if (!schedule) {
        throw new Error('No schedule found');
    }

    let icsString = 'BEGIN:VCALENDAR\nVERSION:2.0\nCALSCALE:GREGORIAN\nX-WR-CALNAME:My Schedule\n';

    downloadBlob(icsString, 'CALENDAR', 'schedule.ics');
};

/**
 * Saves the calendar as a PNG image.
 *
 * @param calendarRef - The reference to the calendar component.
 */
export const saveCalAsPng = () => {
    const rootNode = document.createElement('div');
    rootNode.style.backgroundColor = 'white';
    rootNode.style.position = 'fixed';
    rootNode.style.zIndex = '1000';
    rootNode.style.top = '-10000px';
    rootNode.style.left = '-10000px';
    rootNode.style.width = '1165px';
    rootNode.style.height = '754px';
    document.body.appendChild(rootNode);

    const clonedNode = document.querySelector('#root')!.cloneNode(true) as HTMLDivElement;
    clonedNode.style.backgroundColor = 'white';
    (clonedNode.firstChild as HTMLDivElement).classList.add('screenshot-in-progress');

    return new Promise<void>((resolve, reject) => {
        requestAnimationFrame(async () => {
            rootNode.appendChild(clonedNode);

            try {
                const screenshotBlob = await toBlob(clonedNode, {
                    cacheBust: true,
                    canvasWidth: 1165 * 2,
                    canvasHeight: 754 * 2,
                    skipAutoScale: true,
                    pixelRatio: 2,
                });

                if (!screenshotBlob) {
                    throw new Error('Failed to create screenshot');
                }

                downloadBlob(screenshotBlob, 'IMAGE', 'my-calendar.png');
            } catch (e: unknown) {
                console.error(e);
                reject(e);
            } finally {
                document.body.removeChild(rootNode);
                resolve();
            }
        });
    });
};
