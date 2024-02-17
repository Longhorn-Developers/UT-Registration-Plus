import type { Meta, StoryObj } from '@storybook/react';
import { Course, Status } from 'src/shared/types/Course';
import { CourseMeeting, DAY_MAP } from 'src/shared/types/CourseMeeting';
import { CourseSchedule } from 'src/shared/types/CourseSchedule';
import Instructor from 'src/shared/types/Instructor';

import CoursePopup2 from 'src/views/components/injected/CoursePopup2/CoursePopup2';

const exampleCourse: Course = new Course({
    uniqueId: 47280,
    number: '331C',
    fullName: "BVO 331C Bevo's Seminar Longhorn Care",
    courseName: "Bevo's Seminar Longhorn Care",
    department: 'BVO',
    creditHours: 3,
    status: Status.OPEN,
    instructors: [new Instructor({ fullName: "Hook'em", firstName: '', lastName: "Hook'em" })],
    isReserved: true,
    description: [
        'Restricted to Students in the School of Longhorn Enthusiasts',
        'Immerse yourself in the daily routine of a longhorn—sunrise pasture walks and the best shady spots for a midday siesta. Understand the behavioral science behind our mascot’s stoic demeanor during games.',
        'BVO 311C and 312H may not both be counted.',
        'Prerequisite: Grazing 311 or 311H.',
        'May be counted toward the Independent Inquiry flag requirement. May be counted toward the Writing flag requirement.',
        'Offered on the letter-grade basis only.',
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
        year: 2024,
        season: 'Spring',
    },
});

const meta: Meta<typeof CoursePopup2> = {
    title: 'Components/Injected/CoursePopup2',
    component: CoursePopup2,
    argTypes: {
        onClose: { action: 'onClose' },
    },
};

export default meta;
type Story = StoryObj<typeof CoursePopup2>;

export const Default: Story = {
    args: {
        course: exampleCourse,
    },
};
