import { Course, Status } from '@shared/types/Course';
import { CourseMeeting, DAY_MAP } from '@shared/types/CourseMeeting';
import { CourseSchedule } from '@shared/types/CourseSchedule';
import Instructor from '@shared/types/Instructor';
import type { Meta, StoryObj } from '@storybook/react';
import CourseCatalogInjectedPopup from '@views/components/injected/CourseCatalogInjectedPopup/CourseCatalogInjectedPopup';

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
    url: 'https://utdirect.utexas.edu/apps/registrar/course_schedule/20242/50825/',
    flags: ['Writing', 'Independent Inquiry'],
    instructionMode: 'In Person',
    semester: {
        code: '12345',
        year: 2024,
        season: 'Spring',
    },
});

const bevoCourse: Course = new Course({
    uniqueId: 47280,
    number: '311C',
    fullName: "BVO 311C BEVO'S SEMINAR LONGHORN CARE",
    courseName: "BEVO'S SEMINAR LONGHORN CARE",
    department: 'BVO',
    creditHours: 3,
    status: Status.OPEN,
    instructors: [new Instructor({ fullName: 'BEVO', firstName: '', lastName: 'BEVO', middleInitial: '' })],
    isReserved: false,
    description: [
        'Restricted to Students in the School of Longhorn Enthusiasts',
        'Immerse yourself in the daily routine of a longhorn—sunrise pasture walks and the best shady spots for a midday siesta. Understand the behavioral science behind our mascot’s stoic demeanor during games.',
        'BVO 311C and 312H may not both be counted.',
        'Prerequisite: Grazing 311 or 311H.',
        'May be counted toward the Independent Inquiry flag requirement. May be counted toward the Writing flag requirement',
        'Offered on the letter-grade basis only.',
    ],
    schedule: new CourseSchedule({
        meetings: [
            new CourseMeeting({
                days: ['Tuesday', 'Thursday'],
                startTime: 480,
                endTime: 570,
                location: { building: 'UTC', room: '123' },
            }),
            new CourseMeeting({
                days: ['Thursday'],
                startTime: 570,
                endTime: 630,
                location: { building: 'JES', room: '123' },
            }),
        ],
    }),
    url: 'https://utdirect.utexas.edu/apps/registrar/course_schedule/20242/12345/',
    flags: ['Independent Inquiry', 'Writing'],
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

export const OpenCourse: Story = {
    args: {
        course: exampleCourse,
    },
};

export const ClosedCourse: Story = {
    args: {
        course: {
            ...exampleCourse,
            status: Status.CLOSED,
        } as Course,
    },
};

export const CourseWithNoData: Story = {
    args: {
        course: bevoCourse,
    },
};
