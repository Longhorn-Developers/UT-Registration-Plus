import { CalendarCourseCellProps } from 'src/views/components/common/CalendarCourseCell/CalendarCourseCell';
import useSchedules from './useSchedules';

const dayToNumber = {
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

interface SomeObject {
    calendarGridPoint?: CalendarGridPoint;
    componentProps: CalendarCourseCellProps;
}

const convertMinutesToIndex = (minutes: number): number => Math.floor(minutes - 420 / 30);

export function useFlattenedCourseSchedule() {
    const [activeSchedule] = useSchedules();
    const { courses } = activeSchedule;

    const out = courses.flatMap(course => {
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
                    componentProps: {
                        courseDeptAndInstr,
                        status,
                        colors: {
                            primaryColor: 'ut-gray',
                            secondaryColor: 'ut-gray',
                        },
                    },
                },
            ];
        }
        return meetings.flatMap(meeting => {
            const { days, startTime, endTime, location } = meeting;
            const time = meeting.getTimeString({ separator: ' - ', capitalize: true });
            const timeAndLocation = `${time} - ${location ? location.building : 'WB'}`;

            return days.map(d => {
                const dayIndex = dayToNumber[d];
                const startIndex = convertMinutesToIndex(startTime);
                const endIndex = convertMinutesToIndex(endTime);
                const calendarGridPoint: CalendarGridPoint = {
                    dayIndex,
                    startIndex,
                    endIndex,
                };

                return {
                    calendarGridPoint,
                    componentProps: {
                        courseDeptAndInstr,
                        timeAndLocation,
                        status,
                        colors: {
                            primaryColor: 'ut-orange',
                            secondaryColor: 'ut-orange',
                        },
                    },
                };
            });
        });
    });

    return out;
}
