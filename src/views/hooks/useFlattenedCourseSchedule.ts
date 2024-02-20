import { CalendarCourseCellProps } from 'src/views/components/calendar/CalendarCourseCell/CalendarCourseCell';
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

/**
 * Return type of useFlattenedCourseSchedule
 */
export interface CalendarGridCourse {
    calendarGridPoint: CalendarGridPoint;
    componentProps: CalendarCourseCellProps;
}

const convertMinutesToIndex = (minutes: number): number => Math.floor(minutes - 420 / 30);

/**
 * Get the active schedule, and convert it to be render-able into a calendar.
 * @returns CalendarGridCourse
 */
export function useFlattenedCourseSchedule(): CalendarGridCourse[] {
    const [activeSchedule] = useSchedules();
    const { courses } = activeSchedule;

    return courses
        .flatMap(course => {
            const {
                status,
                department,
                instructors,
                schedule: { meetings },
            } = course;
            const courseDeptAndInstr = `${department} ${instructors[0].lastName}`;

            if (meetings.length === 0) {
                // asynch, online course
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
                                // TODO: figure out colors - these are defaults
                                primaryColor: 'ut-gray',
                                secondaryColor: 'ut-gray',
                            },
                        },
                    },
                ];
            }

            // in-person
            return meetings.flatMap(meeting => {
                const { days, startTime, endTime, location } = meeting;
                const time = meeting.getTimeString({ separator: '-', capitalize: true });
                const timeAndLocation = `${time} - ${location ? location.building : 'WB'}`;

                return days.map(d => ({
                    calendarGridPoint: {
                        dayIndex: dayToNumber[d],
                        startIndex: convertMinutesToIndex(startTime),
                        endIndex: convertMinutesToIndex(endTime),
                    },
                    componentProps: {
                        courseDeptAndInstr,
                        timeAndLocation,
                        status,
                        colors: {
                            // TODO: figure out colors - these are defaults
                            primaryColor: 'ut-orange',
                            secondaryColor: 'ut-orange',
                        },
                    },
                }));
            });
        })
        .sort((a: CalendarGridCourse, b: CalendarGridCourse) => {
            if (a.calendarGridPoint.dayIndex !== b.calendarGridPoint.dayIndex) {
                return a.calendarGridPoint.dayIndex - b.calendarGridPoint.dayIndex;
            }
            if (a.calendarGridPoint.startIndex !== b.calendarGridPoint.startIndex) {
                return a.calendarGridPoint.startIndex - b.calendarGridPoint.startIndex;
            }
            return a.calendarGridPoint.endIndex - b.calendarGridPoint.endIndex;
        });
}
