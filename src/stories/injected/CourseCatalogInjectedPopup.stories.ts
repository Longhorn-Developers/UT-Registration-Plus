import type { Meta, StoryObj } from '@storybook/react';
import { Course, Status } from 'src/shared/types/Course';
import { CourseMeeting, DAY_MAP } from 'src/shared/types/CourseMeeting';
import { CourseSchedule } from 'src/shared/types/CourseSchedule';
import Instructor from 'src/shared/types/Instructor';

import CourseCatalogInjectedPopup from 'src/views/components/injected/CourseCatalogInjectedPopup/CourseCatalogInjectedPopup';

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

const meta: Meta<typeof CourseCatalogInjectedPopup> = {
    title: 'Components/Injected/CourseCatalogInjectedPopup',
    component: CourseCatalogInjectedPopup,
    argTypes: {
        onClose: { action: 'onClose' },
    },
};

export default meta;
type Story = StoryObj<typeof CourseCatalogInjectedPopup>;

export const Default: Story = {
    args: {
        course: exampleCourse,
    },
};
