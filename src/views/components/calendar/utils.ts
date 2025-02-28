import { tz, TZDate } from '@date-fns/tz';
import { utc, UTCDate } from '@date-fns/utc';
import { UserScheduleStore } from '@shared/storage/UserScheduleStore';
import type { UserSchedule } from '@shared/types/UserSchedule';
import { downloadBlob } from '@shared/util/downloadBlob';
import type { Serialized } from 'chrome-extension-toolkit';
import type { DateArg, Day } from 'date-fns';
import { addDays, formatISO, getDay, nextDay, set as setMultiple, toDate } from 'date-fns';
import { toBlob } from 'html-to-image';

import { academicCalendars } from './academic-calendars';

const TIMEZONE = 'America/Chicago';

export const CAL_MAP = {
    Sunday: 'SU',
    Monday: 'MO',
    Tuesday: 'TU',
    Wednesday: 'WE',
    Thursday: 'TH',
    Friday: 'FR',
    Saturday: 'SA',
} as const satisfies Record<string, string>;

export const DAY_NAME_TO_NUMBER = {
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

const nextDayInclusive = <DateType extends Date, ResultDate extends Date = DateType>(
    date: DateArg<DateType>,
    day: Day
): ResultDate => {
    if (getDay(date) === day) {
        return toDate(date);
    }

    return nextDay(date, day);
};

/**
 * Saves the current schedule as a calendar file in the iCalendar format (ICS).
 * Fetches the current active schedule and converts it into an ICS string.
 * Downloads the ICS file to the user's device.
 */
export const saveAsCal = async () => {
    const schedule = await getSchedule(); // Assumes this fetches the current active schedule

    let icsString = 'BEGIN:VCALENDAR\nVERSION:2.0\nCALSCALE:GREGORIAN\nX-WR-CALNAME:My Schedule\n';

    if (!schedule) {
        throw new Error('No schedule found');
    }

    schedule.courses.forEach(course => {
        course.schedule.meetings.forEach(meeting => {
            const { startTime, endTime, days, location } = meeting;
            console.log(course.semester.code);

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
                new TZDate(academicCalendar.firstClassDate, TIMEZONE),
                DAY_NAME_TO_NUMBER[days[0]!]
            );

            const startTimeDate = setMultiple(startDate, {
                hours: Math.floor(startTime / 60),
                minutes: startTime % 60,
            });

            const endTimeDate = setMultiple(startDate, { hours: Math.floor(endTime / 60), minutes: endTime % 60 });

            // // Format start and end times to HHMMSS
            // const formattedStartTime = formatToHHMMSS(startTime);
            // const formattedEndTime = formatToHHMMSS(endTime);

            // Map days to ICS compatible format
            console.log(days);
            const icsDays = days.map(day => CAL_MAP[day]).join(',');
            console.log(icsDays);

            // console.log({
            //     startTimeDate: formatISO(startTimeDate, { format: 'basic' /* , in: tz('utc') */ }),
            //     endTimeDate: formatISO(endTimeDate, { format: 'basic' /* , in: tz('utc') */ }),
            // });

            const untilDate = addDays(new TZDate(academicCalendar.lastClassDate, TIMEZONE), 1);

            // Assuming course has date started and ended, adapt as necessary
            // const year = new Date().getFullYear(); // Example year, adapt accordingly
            // Example event date, adapt startDate according to your needs
            const startDateFormatted = formatISO(startTimeDate, { format: 'basic', in: tz('utc') });
            const endDateFormatted = formatISO(endTimeDate, { format: 'basic', in: tz('utc') });
            const untilDateFormatted = formatISO(untilDate, { format: 'basic', in: tz('utc') });

            icsString += `BEGIN:VEVENT\n`;
            icsString += `DTSTART:${startDateFormatted}\n`;
            icsString += `DTEND:${endDateFormatted}\n`;
            icsString += `RRULE:FREQ=WEEKLY;BYDAY=${icsDays};UNTIL=${untilDateFormatted}\n`;
            icsString += `SUMMARY:${course.fullName}\n`;
            icsString += `LOCATION:${location?.building ?? ''} ${location?.room ?? ''}\n`;
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
