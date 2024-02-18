import type { Meta, StoryObj } from '@storybook/react';
import { Course, Status } from 'src/shared/types/Course';
import { CourseMeeting, DAY_MAP } from 'src/shared/types/CourseMeeting';
import { CourseSchedule } from 'src/shared/types/CourseSchedule';
import Instructor from 'src/shared/types/Instructor';
import { UserSchedule } from 'src/shared/types/UserSchedule';

import CoursePopup from 'src/views/components/injected/CoursePopup/CoursePopup';

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

// const exampleCourse: Course = new Course({
//     courseName: 'ELEMS OF COMPTRS/PROGRAMMNG-WB',
//     creditHours: 3,
//     department: 'C S',
//     description: [
//         'Problem solving and fundamental algorithms for various applications in science, business, and on the World Wide Web, and introductory programming in a modern object-oriented programming language.',
//         'Only one of the following may be counted: Computer Science 303E, 312, 312H. Credit for Computer Science 303E may not be earned after a student has received credit for Computer Science 314, or 314H. May not be counted toward a degree in computer science.',
//         'May be counted toward the Quantitative Reasoning flag requirement.',
//         'Designed to accommodate 100 or more students.',
//         'Taught as a Web-based course.',
//     ],
//     flags: ['Quantitative Reasoning'],
//     fullName: 'C S 303E ELEMS OF COMPTRS/PROGRAMMNG-WB',
//     instructionMode: 'Online',
//     instructors: [],
//     isReserved: false,
//     number: '303E',
//     schedule: {
//         meetings: [
//             new CourseMeeting({
//                 days: ['Tuesday', 'Thursday'],
//                 endTime: 660,
//                 startTime: 570,
//             }),
//         ],
//     },
//     semester: {
//         code: '12345',
//         season: 'Spring',
//         year: 2024,
//     },
//     status: Status.CANCELLED,
//     uniqueId: 12345,
//     url: 'https://utdirect.utexas.edu/apps/registrar/course_schedule/20242/12345/',
// });

const exampleSchedule: UserSchedule = new UserSchedule({
    courses: [exampleCourse],
    name: 'Example Schedule',
});

const meta: Meta<typeof CoursePopup> = {
    title: 'Components/Injected/CoursePopup2',
    component: CoursePopup,
    argTypes: {
        onClose: { action: 'onClose' },
    },
};

export default meta;
type Story = StoryObj<typeof CoursePopup>;

export const Default: Story = {
    args: {
        course: exampleCourse,
    },
};
