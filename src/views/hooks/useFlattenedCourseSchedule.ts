import type { Course, StatusType } from '@shared/types/Course';
import { type CourseMeeting, DAY_MAP } from '@shared/types/CourseMeeting';
import type { UserSchedule } from '@shared/types/UserSchedule';
import type { CalendarCourseCellProps } from '@views/components/calendar/CalendarCourseCell';

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
}

/**
 * Represents a flattened course schedule.
 */
export interface FlattenedCourseSchedule {
    courseCells: CalendarGridCourse[];
    activeSchedule: UserSchedule;
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

    const processedCourses = activeSchedule.courses
        .flatMap(course => {
            const { status, courseDeptAndInstr, meetings } = extractCourseInfo(course);

            if (meetings.length === 0) {
                return processAsyncCourses({ courseDeptAndInstr, status, course });
            }

            return meetings.flatMap(meeting => {
                if (meeting.days.includes(DAY_MAP.S) || meeting.startTime < 480) {
                    return processAsyncCourses({ courseDeptAndInstr, status, course });
                }

                return processInPersonMeetings(meeting, courseDeptAndInstr, status, course);
            });
        })
        .sort(sortCourses);

    return {
        courseCells: processedCourses,
        activeSchedule,
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
        courseDeptAndInstr += course.instructors
            .map(instructor => instructor.toString({ format: 'last', case: 'capitalize' }))
            .join('; ');
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
                colors: course.colors,
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
    course: Course
): CalendarGridCourse[] {
    const { days, startTime, endTime, location } = meeting;
    const midnightIndex = 1440;
    const normalizingTimeFactor = 720;
    const time = meeting.getTimeString({ separator: '-', capitalize: true });
    const timeAndLocation = `${time}${location ? ` - ${location.building}` : ''}`;
    const normalizedStartTime = startTime >= midnightIndex ? startTime - normalizingTimeFactor : startTime;
    const normalizedEndTime = endTime >= midnightIndex ? endTime - normalizingTimeFactor : endTime;

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
            colors: course.colors,
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
