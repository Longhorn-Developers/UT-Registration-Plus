import type { Course } from '@shared/types/Course';
import { type CourseMeeting, DAY_MAP } from '@shared/types/CourseMeeting';
import type { UserSchedule } from '@shared/types/UserSchedule';

import { useActiveSchedule } from './useSchedules';

const dayToNumber = {
    Monday: 0,
    Tuesday: 1,
    Wednesday: 2,
    Thursday: 3,
    Friday: 4,
    Saturday: 5,
    Sunday: 6,
} as const satisfies Record<string, number>;

interface CalendarGridPoint {
    dayIndex: number;
    startIndex: number;
    endIndex: number;
}

// interface componentProps {
//     calendarCourseCellProps: CalendarCourseCellProps;
// }

/**
 * Return type of useFlattenedCourseSchedule
 */
export interface CalendarGridCourse {
    calendarGridPoint: CalendarGridPoint;
    course: Course;
    async: boolean;
    timeAndLocation?: string;
    gridColumnStart?: number;
    gridColumnEnd?: number;
    totalColumns?: number;
    concurrentCells?: CalendarGridCourse[];
}

/**
 * Represents a flattened course schedule.
 */
export interface FlattenedCourseSchedule {
    courseCells: CalendarGridCourse[];
    activeSchedule: UserSchedule;
    startMinutes: number;
    endMinutes: number;
}

/**
 * 8:00 AM latest start time aka DEFAULT, in minutes
 */
export const GRID_DEFAULT_START = 480;

/**
 * 9:00 PM earliest end time aka DEFAULT, in minutes
 */
export const GRID_DEFAULT_END = 1260;

/**
 * Converts minutes to an index value.
 *
 * @param minutes - The number of minutes.
 * @returns The index value.
 */
export const convertMinutesToIndex = (minutes: number, gridStartMinutes = GRID_DEFAULT_START): number =>
    // 480 = 8 a.m., 30 = 30 minute slots, 2 header rows, and grid rows start at 1
    // ok so originally we had a hardcoded start of 6 am but now  we want start to be dynamic, with a max of 8 AM, oterhwise depending on the start of earliest class
    Math.floor((minutes - gridStartMinutes) / 30) + 2 + 1;

/**
 * Get the active schedule, and convert it to be render-able into a calendar.
 * @returns CalendarGridCourse
 */
export function useFlattenedCourseSchedule(): FlattenedCourseSchedule {
    const activeSchedule = useActiveSchedule();
    const allMeetings = activeSchedule.courses.flatMap(c => c.schedule.meetings);

    // go through every meeting we have and finds minimum start time with starting best so far being GRID_DEFAULT_START_MINUTES
    // this variable will go on a journey through time and space to finally be delivered to the viewable calendar grid as the start hour of the entire grid
    const rawGridStartMinutes = allMeetings.reduce((earliest, current) => {
        if (current.days.includes(DAY_MAP.S) || current.startTime >= 1440) {
            // keep accumulator value unchanged, go to next iteration
            return earliest;
        }

        const t = current.startTime >= 1440 ? current.startTime - 720 : current.startTime;
        return Math.min(earliest, t);
    }, GRID_DEFAULT_START);
    // round down to closest hour (in minute units)
    const gridStartMinutes = Math.floor(rawGridStartMinutes / 60) * 60;

    const rawGridEndMinutes = allMeetings.reduce((latest, current) => {
        if (current.days.includes(DAY_MAP.S) || current.endTime >= 1440) {
            return latest;
        }
        const t = current.endTime >= 1440 ? current.endTime - 720 : current.endTime;
        return Math.max(latest, t);
    }, GRID_DEFAULT_END);
    // round up to closest hour (in minute units)
    const gridEndMinutes = Math.ceil(rawGridEndMinutes / 60) * 60;

    const processedCourses = activeSchedule.courses
        .flatMap(course => {
            const { meetings } = course.schedule;

            if (meetings.length === 0) {
                return processAsyncCourses({
                    course,
                });
            }

            return meetings.flatMap(meeting => {
                if (meeting.days.includes(DAY_MAP.S)) {
                    return processAsyncCourses({ course });
                }

                return processInPersonMeetings(meeting, course, gridStartMinutes);
            });
        })
        .sort(sortCourses);

    return {
        courseCells: processedCourses,
        activeSchedule,
        startMinutes: gridStartMinutes,
        endMinutes: gridEndMinutes,
    };
}

/**
 * Function to process each in-person class into its distinct meeting objects for calendar grid
 */
function processAsyncCourses({ course }: { course: Course }): CalendarGridCourse[] {
    return [
        {
            calendarGridPoint: {
                dayIndex: -1,
                startIndex: -1,
                endIndex: -1,
            },
            course,
            async: true,
        },
    ];
}

/**
 * Function to process each in-person class into its distinct meeting objects for calendar grid
 */
function processInPersonMeetings(
    meeting: CourseMeeting,
    course: Course,
    gridStartMinutes: number
): CalendarGridCourse[] {
    const { days } = meeting;
    const { normalizedStartTime, normalizedEndTime } = meeting.getNormalizedTimes();
    const timeAndLocation = meeting.getTimeAndLocationString();

    return days.map(day => ({
        calendarGridPoint: {
            dayIndex: dayToNumber[day],
            // pass in startMinutes to find the offset
            startIndex: convertMinutesToIndex(normalizedStartTime, gridStartMinutes),
            endIndex: convertMinutesToIndex(normalizedEndTime, gridStartMinutes),
        },
        course,
        timeAndLocation,
        async: false,
    }));
}

/**
 * Utility function to sort courses for the calendar grid
 */
function sortCourses(a: CalendarGridCourse, b: CalendarGridCourse): number {
    const { dayIndex: dayIndexA, startIndex: startIndexA, endIndex: endIndexA } = a.calendarGridPoint;
    const { dayIndex: dayIndexB, startIndex: startIndexB, endIndex: endIndexB } = b.calendarGridPoint;

    if (dayIndexA !== dayIndexB) {
        return dayIndexA - dayIndexB;
    }
    if (startIndexA !== startIndexB) {
        return startIndexA - startIndexB;
    }
    return endIndexA - endIndexB;
}
