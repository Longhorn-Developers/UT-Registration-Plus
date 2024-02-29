import type { CalendarCourseCellProps } from '@views/components/calendar/CalendarCourseCell/CalendarCourseCell';
import type { Course, StatusType } from 'src/shared/types/Course';
import type { CourseMeeting } from 'src/shared/types/CourseMeeting';
import type { UserSchedule } from 'src/shared/types/UserSchedule';

import useSchedules from './useSchedules';



const dayToNumber: { [day: string]: number } = {
    Monday: 0,
    Tuesday: 1,
    Wednesday: 2,
    Thursday: 3,
    Friday: 4,
};

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
            activeSchedule: {
                name: 'Something may have went wrong',
                courses: [],
                hours: 0,
            } as UserSchedule,
        } as FlattenedCourseSchedule;
    }

    if (activeSchedule.courses.length === 0) {
        return {
            courseCells: [] as CalendarGridCourse[],
            activeSchedule: {
                name: activeSchedule.name,
                courses: activeSchedule.courses,
                hours: activeSchedule.hours,
                containsCourse: activeSchedule.containsCourse,
            } as UserSchedule,
        } as FlattenedCourseSchedule;

    }

    const { courses, name, hours } = activeSchedule;

    const processedCourses = courses.flatMap((course: Course) => {
        const { status, courseDeptAndInstr, meetings } = extractCourseInfo(course);
    
        if (meetings.length === 0) {
            return processAsyncCourses({ courseDeptAndInstr, status, course });
        }
    
        return meetings.flatMap((meeting: CourseMeeting) => 
            processInPersonMeetings(meeting, { courseDeptAndInstr, status, course })
        );
    }).sort(sortCourses);
    
    return {
        courseCells: processedCourses as CalendarGridCourse[],
        activeSchedule: { name, courses, hours } as UserSchedule,
    } as FlattenedCourseSchedule;

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
function processAsyncCourses({ courseDeptAndInstr, status, course }: { courseDeptAndInstr: string, status: StatusType, course: Course }) {
    return [{
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
    }] satisfies CalendarGridCourse[];
}

/**
 * Function to process each in-person class into its distinct meeting objects for calendar grid
 */
function processInPersonMeetings({ days, startTime, endTime, location }: CourseMeeting, { courseDeptAndInstr, status, course }) {
    const time = getTimeString({ separator: '-', capitalize: true }, startTime, endTime);
    const timeAndLocation = `${time} - ${location ? location.building : 'WB'}`;
    return days.map(day => ({
        calendarGridPoint: {
            dayIndex: dayToNumber[day],
            startIndex: convertMinutesToIndex(startTime),
            endIndex: convertMinutesToIndex(endTime),
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
function sortCourses(a, b) {
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


/**
 * Utility function also present in CourseMeeting object. Wasn't being found at runtime, so I copied it over.
 */
function getTimeString(options: TimeStringOptions, startTime: number, endTime: number): string {
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

    if (options.capitalize) {
        startTimeString = startTimeString.toUpperCase();
        endTimeString = endTimeString.toUpperCase();
    }

    return `${startTimeString} ${options.separator} ${endTimeString}`;
}

/**
 * Options to control the format of the time string
 */
type TimeStringOptions = {
    /** the separator between the start and end times */
    separator: string;
    /** capitalizes the AM/PM */
    capitalize?: boolean;
};