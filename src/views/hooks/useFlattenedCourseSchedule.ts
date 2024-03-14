import type { Course, StatusType } from '@shared/types/Course';
import type { CourseMeeting } from '@shared/types/CourseMeeting';
import { UserSchedule } from '@shared/types/UserSchedule';
import type { CalendarCourseCellProps } from '@views/components/calendar/CalendarCourseCell/CalendarCourseCell';

import useSchedules from './useSchedules';

const dayToNumber = {
    Monday: 0,
    Tuesday: 1,
    Wednesday: 2,
    Thursday: 3,
    Friday: 4,
} as const satisfies Record<string, number>;

interface CalendarGridPoint {
    dayIndex: number;
    startIndex: number;
    endIndex: number;
}

interface componentProps {
    calendarCourseCellProps: CalendarCourseCellProps;
}

/**
 * Return type of useFlattenedCourseSchedule
 */
export interface CalendarGridCourse {
    calendarGridPoint: CalendarGridPoint;
    componentProps: CalendarCourseCellProps;
    course: Course;
    gridColumnStart?: number;
    gridColumnEnd?: number;
    totalColumns?: number;
}

export interface FlattenedCourseSchedule {
    courseCells: CalendarGridCourse[];
    activeSchedule?: UserSchedule;
}

/**
 * Converts minutes to an index value.
 * @param minutes The number of minutes.
 * @returns The index value.
 */
export const convertMinutesToIndex = (minutes: number): number => Math.floor((minutes - 420) / 30);

/**
 * Get the active schedule, and convert it to be render-able into a calendar.
 * @returns CalendarGridCourse
 */
export function useFlattenedCourseSchedule(): FlattenedCourseSchedule {
    const [activeSchedule] = useSchedules();

    if (!activeSchedule) {
        return {
            courseCells: [] as CalendarGridCourse[],
            activeSchedule: new UserSchedule({
                courses: [],
                id: 'error',
                name: 'Something may have went wrong',
                hours: 0,
                updatedAt: Date.now(),
            }),
        } satisfies FlattenedCourseSchedule;
    }

    if (activeSchedule.courses.length === 0) {
        return {
            courseCells: [] as CalendarGridCourse[],
            activeSchedule,
        } satisfies FlattenedCourseSchedule;
    }

    const { courses, name, hours } = activeSchedule;

    const processedCourses = courses
        .flatMap((course: Course) => {
            const { status, courseDeptAndInstr, meetings } = extractCourseInfo(course);

            if (meetings.length === 0) {
                return processAsyncCourses({ courseDeptAndInstr, status, course });
            }

            return meetings.flatMap((meeting: CourseMeeting) =>
                processInPersonMeetings(meeting, { courseDeptAndInstr, status, course })
            );
        })
        .sort(sortCourses);

    return {
        courseCells: processedCourses as CalendarGridCourse[],
        activeSchedule: { name, courses, hours } as UserSchedule,
    } satisfies FlattenedCourseSchedule;
}

// Helper function to extract and format basic course information
function extractCourseInfo(course: Course) {
    const {
        status,
        department,
        instructors,
        schedule: { meetings },
    } = course;
    const courseDeptAndInstr = `${department} ${instructors[0].lastName}`;
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
}) {
    return [
        {
            calendarGridPoint: {
                dayIndex: 0,
                startIndex: 0,
                endIndex: 0,
            },
            componentProps: {
                courseDeptAndInstr,
                status,
                colors: {
                    primaryColor: 'ut-gray',
                    secondaryColor: 'ut-gray',
                },
            },
            course,
        },
    ] satisfies CalendarGridCourse[];
}

/**
 * Function to process each in-person class into its distinct meeting objects for calendar grid
 */
function processInPersonMeetings(meeting: CourseMeeting, { courseDeptAndInstr, status, course }) {
    const { days, startTime, endTime, location } = meeting;
    const midnightIndex = 1440;
    const normalizingTimeFactor = 720;
    const time = meeting.getTimeString({ separator: '-', capitalize: true });
    const timeAndLocation = `${time} - ${location ? location.building : 'WB'}`;
    let normalizedStartTime = startTime >= midnightIndex ? startTime - normalizingTimeFactor : startTime;
    let normalizedEndTime = endTime >= midnightIndex ? endTime - normalizingTimeFactor : endTime;
    return days.map(day => ({
        calendarGridPoint: {
            dayIndex: dayToNumber[day],
            startIndex: convertMinutesToIndex(normalizedStartTime),
            endIndex: convertMinutesToIndex(normalizedEndTime),
        },
        componentProps: {
            courseDeptAndInstr,
            timeAndLocation,
            status,
            colors: {
                primaryColor: 'ut-orange',
                secondaryColor: 'ut-orange',
            },
        },
        course,
    })) satisfies CalendarGridCourse[];
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
