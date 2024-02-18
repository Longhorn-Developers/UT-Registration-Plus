import type { Meta, StoryObj } from '@storybook/react';
import { Course, Status } from 'src/shared/types/Course';
import { CourseMeeting } from 'src/shared/types/CourseMeeting';
import Instructor from 'src/shared/types/Instructor';
import { UserSchedule } from 'src/shared/types/UserSchedule';
import CoursePopup from 'src/views/components/injected/CoursePopup/CoursePopup';

const exampleCourse: Course = new Course({
    courseName: 'ELEMS OF COMPTRS/PROGRAMMNG-WB',
    creditHours: 3,
    department: 'C S',
    description: [
        'Problem solving and fundamental algorithms for various applications in science, business, and on the World Wide Web, and introductory programming in a modern object-oriented programming language.',
        'Only one of the following may be counted: Computer Science 303E, 312, 312H. Credit for Computer Science 303E may not be earned after a student has received credit for Computer Science 314, or 314H. May not be counted toward a degree in computer science.',
        'May be counted toward the Quantitative Reasoning flag requirement.',
        'Designed to accommodate 100 or more students.',
        'Taught as a Web-based course.',
    ],
    flags: ['Quantitative Reasoning'],
    fullName: 'C S 303E ELEMS OF COMPTRS/PROGRAMMNG-WB',
    instructionMode: 'Online',
    instructors: [
        new Instructor({
            firstName: 'William',
            lastName: 'Young',
            middleInitial: 'D',
            fullName: 'William D Young',
        }),
        new Instructor({
            firstName: 'William',
            lastName: 'Young',
            middleInitial: 'D',
            fullName: 'William D Young',
        }),
    ],
    isReserved: false,
    number: '303E',
    schedule: {
        meetings: [
            new CourseMeeting({
                days: ['Tuesday', 'Thursday'],
                endTime: 660,
                startTime: 570,
            }),
        ],
    },
    semester: {
        code: '12345',
        season: 'Spring',
        year: 2024,
    },
    status: Status.CANCELLED,
    uniqueId: 12345,
    url: 'https://utdirect.utexas.edu/apps/registrar/course_schedule/20242/12345/',
});

const exampleSchedule: UserSchedule = new UserSchedule({
    courses: [exampleCourse],
    name: 'Example Schedule',
});

const meta = {
    title: 'Components/Injected/CoursePopup',
    component: CoursePopup,
    // tags: ['autodocs'],
    args: {
        course: exampleCourse,
        activeSchedule: exampleSchedule,
    },
    argTypes: {
        course: {
            control: {
                type: 'other',
            },
        },
        activeSchedule: {
            control: {
                type: 'other',
            },
        },
    },
    parameters: {
        design: {
            type: 'figma',
            url: 'https://www.figma.com/file/8tsCay2FRqctrdcZ3r9Ahw/UTRP?type=design&node-id=602-1879&mode=design&t=BoS5xBrpSsjgQXqv-11',
        },
    },
} satisfies Meta<typeof CoursePopup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {
    args: {
        course: new Course({ ...exampleCourse, status: Status.OPEN }),
        activeSchedule: new UserSchedule({
            courses: [],
            name: 'Example Schedule',
        }),
    },
};

export const Closed: Story = {
    args: {
        course: new Course({ ...exampleCourse, status: Status.CLOSED }),
    },
};

export const Cancelled: Story = {
    args: {
        course: new Course({ ...exampleCourse, status: Status.CANCELLED }),
    },
};
