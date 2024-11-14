import { Course, Status } from '@shared/types/Course';
import { CourseMeeting } from '@shared/types/CourseMeeting';
import Instructor from '@shared/types/Instructor';
import { getCourseColors } from '@shared/util/colors';
import type { Meta, StoryObj } from '@storybook/react';
import ConflictsWithWarning from '@views/components/common/ConflictsWithWarning';

export const ExampleCourse: Course = new Course({
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
    core: ['Natural Science and Technology, Part I'],
    fullName: 'C S 303E ELEMS OF COMPTRS/PROGRAMMNG-WB',
    instructionMode: 'Online',
    instructors: [
        new Instructor({
            firstName: 'Bevo',
            lastName: 'Bevo',
            fullName: 'Bevo Bevo',
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
    status: Status.WAITLISTED,
    uniqueId: 12345,
    url: 'https://utdirect.utexas.edu/apps/registrar/course_schedule/20242/12345/',
    scrapedAt: Date.now(),
    colors: getCourseColors('blue', 500),
});
export const ExampleCourse2: Course = new Course({
    courseName: 'PRINCIPLES OF COMPUTER SYSTEMS',
    creditHours: 3,
    department: 'C S',
    description: [
        'Restricted to computer science majors.',
        'An introduction to computer systems software abstractions with an emphasis on the connection of these abstractions to underlying computer hardware. Key abstractions include threads, virtual memory, protection, and I/O. Requires writing of synchronized multithreaded programs and pieces of an operating system.',
        'Computer Science 439 and 439H may not both be counted.',
        'Prerequisite: Computer Science 429, or 429H with a grade of at least C-.',
        'May be counted toward the Independent Inquiry flag requirement.',
    ],
    flags: ['Independent Inquiry'],
    core: ['Natural Science and Technology, Part II'],
    fullName: 'C S 439 PRINCIPLES OF COMPUTER SYSTEMS',
    instructionMode: 'In Person',
    instructors: [
        new Instructor({
            firstName: 'Allison',
            lastName: 'Norman',
            fullName: 'Allison Norman',
        }),
    ],
    isReserved: false,
    number: '439',
    schedule: {
        meetings: [
            new CourseMeeting({
                days: ['Tuesday', 'Thursday'],
                startTime: 930,
                endTime: 1050,
            }),
            new CourseMeeting({
                days: ['Friday'],
                startTime: 600,
                endTime: 720,
            }),
        ],
    },
    semester: {
        code: '12345',
        season: 'Spring',
        year: 2024,
    },
    status: Status.WAITLISTED,
    uniqueId: 67890,
    url: 'https://utdirect.utexas.edu/apps/registrar/course_schedule/20242/12345/',
    scrapedAt: Date.now(),
    colors: getCourseColors('yellow', 500),
});

const meta = {
    title: 'Components/Common/ConflictsWithWarning',
    component: ConflictsWithWarning,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        conflicts: { control: 'object' },
    },
    args: {
        conflicts: [ExampleCourse, ExampleCourse2],
    },
} satisfies Meta<typeof ConflictsWithWarning>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        conflicts: [ExampleCourse, ExampleCourse2],
    },
};
