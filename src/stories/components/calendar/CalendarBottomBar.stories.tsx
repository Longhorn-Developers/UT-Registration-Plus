import { Course, Status } from '@shared/types/Course';
import Instructor from '@shared/types/Instructor';
import { getCourseColors } from '@shared/util/colors';
import type { Meta, StoryObj } from '@storybook/react';
import CalendarBottomBar from '@views/components/calendar/CalendarBottomBar';
import React from 'react';

const exampleGovCourse: Course = new Course({
    courseName: 'Nope',
    creditHours: 3,
    department: 'GOV',
    description: ['nah', 'aint typing this', 'corndog'],
    flags: ['no flag for you >:)'],
    core: ['American and Texas Government'],
    fullName: 'GOV 312L Something something',
    instructionMode: 'Online',
    instructors: [
        new Instructor({
            firstName: 'Bevo',
            lastName: 'Barrymore',
            fullName: 'Bevo Barrymore',
        }),
    ],
    isReserved: false,
    number: '312L',
    schedule: {
        meetings: [],
    },
    scrapedAt: Date.now(),
    semester: {
        code: '12345',
        season: 'Spring',
        year: 2024,
    },
    status: Status.OPEN,
    uniqueId: 12345,
    url: 'https://utdirect.utexas.edu/apps/registrar/course_schedule/20242/12345/',
    colors: getCourseColors('red', 500),
});

const examplePsyCourse: Course = new Course({
    courseName: 'Nope Again',
    creditHours: 3,
    department: 'PSY',
    description: ['nah', 'aint typing this', 'corndog'],
    flags: ['no flag for you >:)'],
    core: ['Social and Behavioral Sciences'],
    fullName: 'PSY 317L Yada yada',
    instructionMode: 'Online',
    scrapedAt: Date.now(),
    instructors: [
        new Instructor({
            firstName: 'Bevo',
            lastName: 'Etz',
            fullName: 'Bevo Etz',
        }),
    ],
    isReserved: false,
    number: '317L',
    schedule: {
        meetings: [],
    },
    semester: {
        code: '12346',
        season: 'Spring',
        year: 2024,
    },
    status: Status.CLOSED,
    uniqueId: 12346,
    url: 'https://utdirect.utexas.edu/apps/registrar/course_schedule/20242/12345/',
    colors: getCourseColors('blue', 500),
});

const meta = {
    title: 'Components/Calendar/CalendarBottomBar',
    component: CalendarBottomBar,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {},
} satisfies Meta<typeof CalendarBottomBar>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        courseCells: [
            {
                async: true,
                calendarGridPoint: { dayIndex: -1, endIndex: -1, startIndex: -1 },
                componentProps: {
                    colors: getCourseColors('pink', 200),
                    courseDeptAndInstr: `${exampleGovCourse.department} ${exampleGovCourse.number} – ${exampleGovCourse.instructors[0]!.lastName}`,
                    status: exampleGovCourse.status,
                },
                course: exampleGovCourse,
            },
            {
                async: true,
                calendarGridPoint: { dayIndex: -1, endIndex: -1, startIndex: -1 },
                componentProps: {
                    colors: getCourseColors('slate', 500),
                    courseDeptAndInstr: `${examplePsyCourse.department} ${examplePsyCourse.number} – ${examplePsyCourse.instructors[0]!.lastName}`,
                    status: examplePsyCourse.status,
                },
                course: examplePsyCourse,
            },
        ],
        setCourse: () => {},
    },
    render: props => (
        <div className='outline-red outline w-292.5!'>
            <CalendarBottomBar {...props} />
        </div>
    ),
};
export const Empty: Story = {
    args: {
        courseCells: [],
        setCourse: () => {},
    },
    render: props => (
        <div className='outline-red outline w-292.5!'>
            <CalendarBottomBar {...props} />
        </div>
    ),
};
