import { tz, TZDate } from '@date-fns/tz';
import exportSchedule from '@pages/background/lib/exportSchedule';
import { UserScheduleStore } from '@shared/storage/UserScheduleStore';
import type { Course } from '@shared/types/Course';
import type { CourseMeeting } from '@shared/types/CourseMeeting';
import Instructor from '@shared/types/Instructor';
import type { UserSchedule } from '@shared/types/UserSchedule';
import { downloadBlob } from '@shared/util/downloadBlob';
import { englishStringifyList } from '@shared/util/string';
import type { CalendarGridCourse } from '@views/hooks/useFlattenedCourseSchedule';
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
export const nextDayInclusive = (date: Date, day: Day): TZDate => {
    if (getDay(date, { in: TZ }) === day) {
        return new TZDate(date, TIMEZONE_ID);
    }

    return nextDay(date, day, { in: TZ });
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
    icsString += `SUMMARY:${course.department} ${course.number} \u2013 ${course.courseName}\n`;

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

    const icsString = scheduleToIcsString(schedule);

    downloadBlob(icsString, 'CALENDAR', 'schedule.ics');
};

/**
 * Saves current schedule to JSON that can be imported on other devices.
 * @param id - Provided schedule ID to download
 */
export const handleExportJson = async (id: string) => {
    const jsonString = await exportSchedule(id);
    if (jsonString) {
        const schedules = await UserScheduleStore.get('schedules');
        const schedule = schedules.find(s => s.id === id);
        const fileName = `${schedule?.name ?? `schedule_${id}`}_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
        await downloadBlob(jsonString, 'JSON', fileName);
    } else {
        console.error('Error exporting schedule: jsonString is undefined');
    }
};

/**
 * Saves the calendar as a PNG image.
 *
 * @param calendarRef - The reference to the calendar component.
 */
export const saveCalAsPng = () => {
    const WIDTH_PX = 1165;
    const HEIGHT_PX = 754;
    const SCALE = 2;

    const rootNode = document.createElement('div');
    rootNode.style.backgroundColor = 'white';
    rootNode.style.position = 'fixed';
    rootNode.style.zIndex = '1000';
    rootNode.style.top = '-10000px';
    rootNode.style.left = '-10000px';
    rootNode.style.width = `${WIDTH_PX}px`;
    rootNode.style.height = `${HEIGHT_PX}px`;
    document.body.appendChild(rootNode);

    const clonedNode = document.querySelector('#root')!.cloneNode(true) as HTMLDivElement;
    clonedNode.style.backgroundColor = 'white';
    (clonedNode.firstChild as HTMLDivElement).classList.add('screenshot-in-progress');

    const calendarTarget = clonedNode.querySelector('.screenshot\\:calendar-target') as HTMLDivElement;
    calendarTarget.style.width = `${WIDTH_PX}px`;
    calendarTarget.style.height = `${HEIGHT_PX}px`;

    return new Promise<void>((resolve, reject) => {
        rootNode.appendChild(clonedNode);
        requestAnimationFrame(async () => {
            try {
                const screenshotBlob = await toBlob(clonedNode, {
                    cacheBust: true,
                    canvasWidth: WIDTH_PX * SCALE,
                    canvasHeight: HEIGHT_PX * SCALE,
                    skipAutoScale: true,
                    pixelRatio: SCALE,
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

/**
 * Determines all the connected components in the list of cells, where two cells
 * are "connected" if there is a path (potentially through other cells) where
 * each neighboring cells have overlapping start/end times
 *
 * @param cells - An array of cells to go on the calendar grid
 * @returns An array of connected components, where the inner array is a list of
 * all cells that there's a path to (potentially through other intervals)
 * without crossing a time gap
 *
 * @remarks The internal fields cell.concurrentCells and cell.hasParent are
 * modified by this function
 *
 * @example [[8am, 9am), [8:30am, 10am), [9:30am, 11am)] // is all one connected component
 * @example [[8am, 9am), [8:30am, 10am), [10am, 11am)] // has two connected components, [[8am, 9am), [8:30am, 10am)] and [[10am, 11am)]]
 */
const findConnectedComponents = (cells: CalendarGridCourse[]): CalendarGridCourse[][] => {
    const connectedComponents: CalendarGridCourse[][] = [];

    for (let i = 0; i < cells.length; i++) {
        const cell = cells[i]!;

        if (!cell.concurrentCells || cell.concurrentCells.length === 0) {
            // If this cell isn't already part of an existing connected component,
            // then we need to make a new one.
            connectedComponents.push([]);
        }

        connectedComponents.at(-1)!.push(cell);

        for (let j = i + 1; j < cells.length; j++) {
            const otherCell = cells[j]!;
            if (otherCell.calendarGridPoint.startIndex >= cell.calendarGridPoint.endIndex) {
                break;
            }

            // By ordering of cells array, we know cell.startTime <= other.startTime
            // By the if check above, we know cell.endTime > other.endTime
            // So, they're concurrent
            // Also, by initializing j to i + 1, we know we don't have duplicates
            cell.concurrentCells!.push(otherCell);
            otherCell.concurrentCells!.push(cell);
        }
    }

    return connectedComponents;
};

/**
 * Assigns column positions to each cell in a set of calendar grid cells.
 * Ensures that overlapping cells are placed in different columns.
 *
 * Inspired by the Greedy Interval-Partitioning algorithm.
 *
 * @param cells - An array of calendar grid course cells to position, must be
 * sorted in increasing order of start time
 * @throws Error if there's no available column for a cell (should never happen if totalColumns is calculated correctly)
 * @remarks The number of columns created is strictly equal to the minimum needed by a perfectly optimal algorithm.
 * The minimum number of columns needed is the maximum number of events that happen concurrently.
 * Research Interval Graphs for more info https://en.wikipedia.org/wiki/Interval_graph
 */
const assignColumns = (cells: CalendarGridCourse[]) => {
    const availableColumns = [true];

    for (const cell of cells) {
        availableColumns.fill(true);
        for (const otherCell of cell.concurrentCells!) {
            if (otherCell.gridColumnStart !== undefined) {
                availableColumns[otherCell.gridColumnStart - 1] = false;
            }
        }

        // Find an available column, or create one if all columns are full
        let column = availableColumns.indexOf(true);

        if (column === -1) {
            column = availableColumns.length;
            availableColumns.push(true);
        }

        // CSS Grid uses 1-based indexing
        cell.gridColumnStart = column + 1;
        cell.gridColumnEnd = column + 2;
    }

    for (const cell of cells) {
        cell.totalColumns = availableColumns.length;
    }
};

/**
 * Calculates the column positions for course cells in a calendar grid.
 * This function handles the layout algorithm for displaying overlapping course meetings
 * in a calendar view. It identifies connected components of overlapping courses,
 * determines the number of columns needed for each component, and assigns appropriate
 * column positions to each cell.
 *
 * @param dayCells - An array of calendar grid course cells for a specific day
 */
export const calculateCourseCellColumns = (dayCells: CalendarGridCourse[]) => {
    // Sort by start time, increasing
    // This is necessary for the correctness of the column assignment
    const cells = dayCells
        .filter(
            cell =>
                !cell.async &&
                cell.calendarGridPoint &&
                typeof cell.calendarGridPoint.startIndex === 'number' &&
                cell.calendarGridPoint.startIndex >= 0
        )
        .toSorted((a, b) => a.calendarGridPoint.startIndex - b.calendarGridPoint.startIndex);

    // Initialize metadata
    for (const cell of cells) {
        cell.concurrentCells = [];
        cell.gridColumnStart = undefined;
        cell.gridColumnEnd = undefined;
    }

    // Construct connected components, set concurrent neighbors
    const connectedComponents = findConnectedComponents(cells);

    // Assign columns for each connectedComponents
    for (const cc of connectedComponents) {
        assignColumns(cc);
    }

    // Clean up
    for (const cell of cells) {
        delete cell.concurrentCells;
    }
};
