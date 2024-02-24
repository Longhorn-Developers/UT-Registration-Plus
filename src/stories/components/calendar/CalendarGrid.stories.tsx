<<<<<<< Updated upstream
import { Meta, StoryObj } from '@storybook/react';
=======
import { Course, Status } from '@shared/types/Course';
import { getCourseColors } from '@shared/util/colors';
import type { Meta, StoryObj } from '@storybook/react';
import type { CalendarGridCourse } from '@views/hooks/useFlattenedCourseSchedule';
import type { Serialized } from 'chrome-extension-toolkit';
import { CourseMeeting, DAY_MAP } from 'src/shared/types/CourseMeeting';
import { CourseSchedule } from 'src/shared/types/CourseSchedule';
import Instructor from 'src/shared/types/Instructor';
import { UserSchedule } from 'src/shared/types/UserSchedule';
>>>>>>> Stashed changes
import CalendarGrid from 'src/views/components/calendar/CalendarGrid/CalendarGrid';
import { getCourseColors } from '@shared/util/colors';
import type { Meta, StoryObj } from '@storybook/react';
import CalendarGrid from '@views/components/calendar/CalendarGrid/CalendarGrid';
import type { CalendarGridCourse } from '@views/hooks/useFlattenedCourseSchedule';

const meta = {
    title: 'Components/Calendar/CalendarGrid',
    component: CalendarGrid,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        saturdayClass: { control: 'boolean' },
    },
} satisfies Meta<typeof CalendarGrid>;
export default meta;

<<<<<<< Updated upstream
const testData: CalendarGridCourse[] = [
=======
const exampleCourse: Course = new Course({
    uniqueId: 50805,
    number: '314',
    fullName: 'C S 314 DATA STRUCTURES',
    courseName: 'DATA STRUCTURES',
    department: 'C S',
    creditHours: 3,
    status: Status.OPEN,
    instructors: [
        new Instructor({ fullName: 'SCOTT, MICHAEL', firstName: 'MICHAEL', lastName: 'SCOTT', middleInitial: 'D' }),
    ],
    isReserved: true,
    description: [
        'Second part of a two-part sequence in programming. Introduction to specifications, simple unit testing, and debugging; building and using canonical data structures; algorithm analysis and reasoning techniques such as assertions and invariants.',
        'Computer Science 314 and 314H may not both be counted.',
        'BVO 311C and 312H may not both be counted.',
        'Prerequisite: Computer Science 312 or 312H with a grade of at least C-.',
        'May be counted toward the Quantitative Reasoning flag requirement.',
    ],
    schedule: new CourseSchedule({
        meetings: [
            new CourseMeeting({
                days: [DAY_MAP.T, DAY_MAP.TH],
                startTime: 480,
                endTime: 570,
                location: { building: 'UTC', room: '123' },
            }),
            new CourseMeeting({
                days: [DAY_MAP.TH],
                startTime: 570,
                endTime: 630,
                location: { building: 'JES', room: '123' },
            }),
        ],
    }),
    url: 'https://utdirect.utexas.edu/apps/registrar/course_schedule/20242/12345/',
    flags: ['Writing', 'Independent Inquiry'],
    instructionMode: 'In Person',
    semester: {
        code: '12345',
        year: 2024,
        season: 'Spring',
    },
});

const exampleSchedule = new UserSchedule({
    name: 'Example Schedule',
    courses: [exampleCourse],
    hours: 3,
} as Serialized<UserSchedule>);

export const exampleCalendarGridCourses: CalendarGridCourse[] = [
>>>>>>> Stashed changes
    {
        calendarGridPoint: {
            dayIndex: 4,
            startIndex: 10,
            endIndex: 11,
        },
        componentProps: {
            courseDeptAndInstr: 'Course 1',
            timeAndLocation: '9:00 AM - 10:00 AM, Room 101',
            status: Status.OPEN,
            colors: getCourseColors('emerald', 500),
        },
    },
    {
        calendarGridPoint: {
            dayIndex: 2,
            startIndex: 5,
            endIndex: 6,
        },
        componentProps: {
            courseDeptAndInstr: 'Course 1',
            timeAndLocation: '9:00 AM - 10:00 AM, Room 101',
            status: Status.OPEN,
            colors: getCourseColors('emerald', 500),
        },
    },
    {
        calendarGridPoint: {
            dayIndex: 1,
            startIndex: 10,
            endIndex: 12,
        },
        componentProps: {
            courseDeptAndInstr: 'Course 2',
            timeAndLocation: '10:00 AM - 11:00 AM, Room 102',
            status: Status.CLOSED,
            colors: getCourseColors('emerald', 500),
        },
    },
    {
        calendarGridPoint: {
            dayIndex: 4,
            startIndex: 10,
            endIndex: 11,
        },
        componentProps: {
            courseDeptAndInstr: 'Course 1',
            timeAndLocation: '9:00 AM - 10:00 AM, Room 101',
            status: Status.OPEN,
            colors: getCourseColors('emerald', 500),
        },
    },
    {
        calendarGridPoint: {
            dayIndex: 1,
            startIndex: 10,
            endIndex: 12,
        },
        componentProps: {
            courseDeptAndInstr: 'Course 2',
            timeAndLocation: '10:00 AM - 11:00 AM, Room 102',
            status: Status.CLOSED,
            colors: getCourseColors('emerald', 500),
        },
    },
    {
        calendarGridPoint: {
            dayIndex: 1,
            startIndex: 10,
            endIndex: 12,
        },
        componentProps: {
            courseDeptAndInstr: 'Course 3',
            timeAndLocation: '10:00 AM - 11:00 AM, Room 102',
            status: Status.CLOSED,
            colors: getCourseColors('emerald', 500),
        },
    },
    {
        calendarGridPoint: {
            dayIndex: 1,
            startIndex: 11,
            endIndex: 13,
        },
        componentProps: {
            courseDeptAndInstr: 'Course 4',
            timeAndLocation: '10:00 AM - 11:00 AM, Room 102',
            status: Status.CLOSED,
            colors: getCourseColors('emerald', 500),
        },
    },
];  */

type Story = StoryObj<typeof meta>;

/*  export const Default: Story = {
    args: {
        saturdayClass: true,
        courseCells: exampleCalendarGridCourses,
    },
};  */
