import { tz } from '@date-fns/tz';
import { UserScheduleStore } from '@shared/storage/UserScheduleStore';
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
    parse,
    set as setMultiple,
    toDate,
} from 'date-fns';
import { toBlob } from 'html-to-image';

import { academicCalendars } from './academic-calendars';

// Do all timezone calculations relative to UT's timezone
const TIMEZONE = 'America/Chicago';
const TZ = tz(TIMEZONE);

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
    formatDate(date, "yyyyMMdd'T'HHmmss", { in: TZ });

// Date format used by iCal
const ISO_DATE_FORMAT = 'yyyy-MM-dd';

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
export const englishStringifyList = (items: string[]): string => {
    if (items.length === 0) return '';
    if (items.length === 1) return items[0]!;
    if (items.length === 2) return `${items[0]} and ${items[1]}`;

    return `${items.slice(0, -1).join(', ')}, and ${items.at(-1)}`;
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

    schedule.courses.forEach(course => {
        course.schedule.meetings.forEach(meeting => {
            const { startTime, endTime, days, location } = meeting;

            if (!course.semester.code) {
                console.error(`No semester found for course uniqueId: ${course.uniqueId}`);
                return;
            }

            if (days.length === 0) {
                console.error(`No days found for course uniqueId: ${course.uniqueId}`);
                return;
            }

            const academicCalendar = academicCalendars[course.semester.code as keyof typeof academicCalendars];

            if (!academicCalendar) {
                console.error(
                    `No academic calendar found for semester code: ${course.semester.code}; course uniqueId: ${course.uniqueId}`
                );
            }

            const startDate = nextDayInclusive(
                parse(academicCalendar.firstClassDate, ISO_DATE_FORMAT, new Date()),
                DAY_NAME_TO_NUMBER[days[0]!]
            );

            const startTimeDate = setMultiple(
                startDate,
                {
                    hours: Math.floor(startTime / 60),
                    minutes: startTime % 60,
                },
                { in: TZ }
            );

            const endTimeDate = setMultiple(
                startDate,
                { hours: Math.floor(endTime / 60), minutes: endTime % 60 },
                { in: TZ }
            );

            const untilDate = addDays(parse(academicCalendar.lastClassDate, ISO_DATE_FORMAT, new Date()), 1);

            const excludedDates = academicCalendar.breakDates
                .flatMap(breakDate => {
                    if (Array.isArray(breakDate)) {
                        return eachDayOfInterval({
                            start: parse(breakDate[0], ISO_DATE_FORMAT, new Date()),
                            end: parse(breakDate[1], ISO_DATE_FORMAT, new Date()),
                        });
                    }

                    return parse(breakDate, ISO_DATE_FORMAT, new Date());
                })
                .map(date =>
                    setMultiple(
                        date,
                        {
                            hours: Math.floor(startTime / 60),
                            minutes: startTime % 60,
                        },
                        { in: TZ }
                    )
                );

            const startDateFormatted = iCalDateFormat(startTimeDate);
            const endDateFormatted = iCalDateFormat(endTimeDate);
            // Map days to ICS compatible format, e.g. MO,WE,FR
            const icsDays = days.map(day => CAL_MAP[day]).join(',');
            // per spec, UNTIL must be in UTC
            const untilDateFormatted = formatISO(untilDate, { format: 'basic', in: tz('utc') });
            const excludedDatesFormatted = excludedDates.map(date => iCalDateFormat(date));

            const instructorsList = englishStringifyList(
                course.instructors
                    .map(instructor => Instructor.prototype.toString.call(instructor, { format: 'first_last' }))
                    .filter(name => name !== '')
            );

            icsString += `BEGIN:VEVENT\n`;
            icsString += `DTSTART;TZID=America/Chicago:${startDateFormatted}\n`;
            icsString += `DTEND;TZID=America/Chicago:${endDateFormatted}\n`;
            icsString += `RRULE:FREQ=WEEKLY;BYDAY=${icsDays};UNTIL=${untilDateFormatted}\n`;
            icsString += `EXDATE;TZID=America/Chicago:${excludedDatesFormatted.join(',')}\n`;
            icsString += `SUMMARY:${course.fullName}\n`;
            icsString += `LOCATION:${location?.building ?? ''} ${location?.room ?? ''}\n`;
            icsString += `DESCRIPTION:Unique number: ${course.uniqueId}\\nTaught by ${instructorsList}\n`;
            icsString += `END:VEVENT\n`;
        });
    });

    icsString += 'END:VCALENDAR';

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
