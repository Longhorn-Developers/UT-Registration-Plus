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
 *
 * @param minutes - The number of minutes.
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
            const { status, courseDetail, meetings } = extractCourseInfo(course);

            if (meetings.length === 0) {
                return processAsyncCourses({ courseDetail, status, course });
            }

            return meetings.flatMap(meeting => {
                if (meeting.days.includes(DAY_MAP.S) || meeting.startTime < 480) {
                    return processAsyncCourses({ courseDetail, status, course });
                }

                return processInPersonMeetings(meeting, courseDetail, status, course);
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

    let courseDetail = `${course.department}, ${course.number} ${course.uniqueId.toString().padStart(5, '0')}`;

    if (course.instructors.length > 0) {
        courseDetail += ' \u2013 ';
        courseDetail += course.instructors.map(instructor => instructor.toString({ format: 'last' })).join('; ');
    }

    return { status, courseDetail, meetings, course };
}

/**
 * Function to process each in-person class into its distinct meeting objects for calendar grid
 */
function processAsyncCourses({
    courseDetail,
    status,
    course,
}: {
    courseDetail: string;
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
                courseDetail,
                status,
                blockData: {
                    calendarGridPoint: { dayIndex: -1, startIndex: -1, endIndex: -1 },
                    componentProps: { courseDetail, status, blockData: {} as CalendarGridCourse },
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
    courseDetail: string,
    status: StatusType,
    course: Course
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
            startIndex: convertMinutesToIndex(normalizedStartTime),
            endIndex: convertMinutesToIndex(normalizedEndTime),
        },
        componentProps: {
            courseDetail,
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
