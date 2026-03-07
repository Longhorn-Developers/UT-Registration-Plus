import { StatusCheckerStore } from '@shared/storage/StatusCheckerStore';
import type { Course, StatusType } from '@shared/types/Course';
import { type CourseMeeting, DAY_MAP } from '@shared/types/CourseMeeting';
import type { UserSchedule } from '@shared/types/UserSchedule';
import type { CalendarCourseCellProps } from '@views/components/calendar/CalendarCourseCell';
import { useEffect, useState } from 'react';

import useSchedules from './useSchedules';

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
    componentProps: CalendarCourseCellProps;
    course: Course;
    async: boolean;
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
}

/**
 * 8:00 AM latest start time aka DEFAULT, in minutes
 */
export const GRID_DEFAULT_START = 480;

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
    const [activeSchedule] = useSchedules();
    const [scrapeInfo, setScrapeInfo] = useState<Record<number, StatusType>>({});
    const allMeetings = activeSchedule.courses.flatMap(c => c.schedule.meetings);

    useEffect(() => {
        StatusCheckerStore.get('scrapeInfo').then(setScrapeInfo);
        const unsubscribe = StatusCheckerStore.subscribe('scrapeInfo', ({ newValue }) => {
            setScrapeInfo(newValue ?? {});
        });

        return () => {
            StatusCheckerStore.unsubscribe(unsubscribe);
        };
    }, []);

    // go through every meeting we have and finds minimum start time with starting best so far being GRID_DEFAULT_START_MINUTES
    // this variable will go on a journey through time and space to finally be delivered to the viewable calendar grid as the start hour of the entire grid
    const gridStartMinutes = allMeetings.reduce((earliest, current) => {
        if (current.days.includes(DAY_MAP.S) || current.startTime >= 1440) {
            // keep accumulator value unchanged, go to next iteration
            return earliest;
        }

        const t = current.startTime >= 1440 ? current.startTime - 720 : current.startTime;
        return Math.min(earliest, t);
    }, GRID_DEFAULT_START);

    const processedCourses = activeSchedule.courses
        .flatMap(course => {
            const { status, courseDeptAndInstr, meetings } = extractCourseInfo(course);
            const overriddenStatus = scrapeInfo[course.uniqueId] ?? status;

            if (meetings.length === 0) {
                return processAsyncCourses({ courseDeptAndInstr, status: overriddenStatus, course });
            }

            return meetings.flatMap(meeting => {
                if (meeting.days.includes(DAY_MAP.S)) {
                    return processAsyncCourses({ courseDeptAndInstr, status: overriddenStatus, course });
                }

                return processInPersonMeetings(meeting, courseDeptAndInstr, overriddenStatus, course, gridStartMinutes);
            });
        })
        .sort(sortCourses);

    return {
        courseCells: processedCourses,
        activeSchedule,
        startMinutes: gridStartMinutes,
    };
}

/**
 * Function to extract and format basic course information
 */
function extractCourseInfo(course: Course) {
    const {
        status,
        schedule: { meetings },
    } = course;

    let courseDeptAndInstr = `${course.department} ${course.number}`;

    if (course.instructors.length > 0) {
        courseDeptAndInstr += ' \u2013 ';
        courseDeptAndInstr += course.instructors.map(instructor => instructor.toString({ format: 'last' })).join('; ');
    }

    return { status, courseDeptAndInstr, meetings, course };
}

/**
 * Function to process each in-person class into its distinct meeting objects for calendar grid
 */
function processAsyncCourses({
    courseDeptAndInstr,
    status,
    course,
}: {
    courseDeptAndInstr: string;
    status: StatusType;
    course: Course;
}): CalendarGridCourse[] {
    return [
        {
            calendarGridPoint: {
                dayIndex: -1,
                startIndex: -1,
                endIndex: -1,
            },
            componentProps: {
                courseDeptAndInstr,
                status,
                blockData: {
                    calendarGridPoint: { dayIndex: -1, startIndex: -1, endIndex: -1 },
                    componentProps: { courseDeptAndInstr, status, blockData: {} as CalendarGridCourse },
                    course,
                    async: true,
                },
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
    courseDeptAndInstr: string,
    status: StatusType,
    course: Course,
    gridStartMinutes: number
): CalendarGridCourse[] {
    const { days, startTime, endTime, location } = meeting;
    const midnightIndex = 1440;
    const normalizingTimeFactor = 720;
    const oneHour = 60;
    const time = meeting.getTimeString({ separator: '–' });
    const normalizedStartTime = startTime >= midnightIndex ? startTime - normalizingTimeFactor : startTime;
    const normalizedEndTime = endTime >= midnightIndex ? endTime - normalizingTimeFactor : endTime;
    const courseDuration = normalizedEndTime - normalizedStartTime;
    let timeAndLocation = `${time}`;
    if (location) {
        if (courseDuration > oneHour) {
            timeAndLocation += `\n${location.building} ${location.room}`;
        } else {
            timeAndLocation += `, ${location.building} ${location.room}`;
        }
    }

    return days.map(day => ({
        calendarGridPoint: {
            dayIndex: dayToNumber[day],
            // pass in startMinutes to find the offset
            startIndex: convertMinutesToIndex(normalizedStartTime, gridStartMinutes),
            endIndex: convertMinutesToIndex(normalizedEndTime, gridStartMinutes),
        },
        componentProps: {
            courseDeptAndInstr,
            timeAndLocation,
            status,
            blockData: {} as CalendarGridCourse,
        },
        course,
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
