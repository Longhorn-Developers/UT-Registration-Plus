import { Course, Status } from '@shared/types/Course';
import { UserSchedule } from '@shared/types/UserSchedule';
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { CourseSchedule } from 'src/shared/types/CourseSchedule';
import Instructor from 'src/shared/types/Instructor';
import Dropdown from 'src/views/components/common/Dropdown/Dropdown';
import { CourseMeeting, DAY_MAP } from 'src/shared/types/CourseMeeting';

const meta: Meta<typeof Dropdown> = {
    title: 'Components/Common/Dropdown',
    component: Dropdown,
    parameters: {
        layout: 'centered',
      },
      tags: ['autodocs'],
      argTypes: {
        beginningState: { control: 'boolean' },
        dummySchedules: {control: 'object'},
        dummyActiveIndex: {control: 'number'},
    },
    render: (args: any) => (
        <Dropdown {...args} />
    ),
} satisfies Meta<typeof Dropdown>;
export default meta;

type Story = StoryObj<typeof meta>;

const schedules = [
    new UserSchedule({
        courses: [
            new Course({
                uniqueId: 123,
                number: '311C',
                fullName: "311C - Bevo's Default Course",
                courseName: "Bevo's Default Course",
                department: 'BVO',
                creditHours: 3,
                status: Status.WAITLISTED,
                instructors: [new Instructor({ firstName: '', lastName: 'Bevo', fullName: 'Bevo' })],
                isReserved: false,
                url: '',
                flags: [],
                schedule: new CourseSchedule({
                    meetings: [
                        new CourseMeeting({
                            days: [DAY_MAP.M, DAY_MAP.W, DAY_MAP.F],
                            startTime: 480,
                            endTime: 570,
                            location: {
                                building: 'UTC',
                                room: '123',
                            },
                        }),
                    ],
                }),
                instructionMode: 'In Person',
                semester: {
                    year: 2024,
                    term: 'Spring',
                },
            })
        ],
        name: 'Main Schedule',
    }),
    new UserSchedule({
        courses: [
            new Course({
                uniqueId: 123,
                number: '311C',
                fullName: "311C - Bevo's Default Course",
                courseName: "Bevo's Default Course",
                department: 'BVO',
                creditHours: 3,
                status: Status.WAITLISTED,
                instructors: [new Instructor({ firstName: '', lastName: 'Bevo', fullName: 'Bevo' })],
                isReserved: false,
                url: '',
                flags: [],
                schedule: new CourseSchedule({
                    meetings: [
                        new CourseMeeting({
                            days: [DAY_MAP.M, DAY_MAP.W, DAY_MAP.F],
                            startTime: 480,
                            endTime: 570,
                            location: {
                                building: 'UTC',
                                room: '123',
                            },
                        }),
                    ],
                }),
                instructionMode: 'In Person',
                semester: {
                    year: 2024,
                    term: 'Spring',
                },
            }),
            new Course({
                uniqueId: 123,
                number: '311C',
                fullName: "311C - Bevo's Default Course",
                courseName: "Bevo's Default Course",
                department: 'BVO',
                creditHours: 3,
                status: Status.WAITLISTED,
                instructors: [new Instructor({ firstName: '', lastName: 'Bevo', fullName: 'Bevo' })],
                isReserved: false,
                url: '',
                flags: [],
                schedule: new CourseSchedule({
                    meetings: [
                        new CourseMeeting({
                            days: [DAY_MAP.M, DAY_MAP.W, DAY_MAP.F],
                            startTime: 480,
                            endTime: 570,
                            location: {
                                building: 'UTC',
                                room: '123',
                            },
                        }),
                    ],
                }),
                instructionMode: 'In Person',
                semester: {
                    year: 2024,
                    term: 'Spring',
                },
            }),

        ],
        name: 'Backup #3',
    }),
];

export const Hidden: Story = {
    parameters: {
        design: {
            type: 'figma',
            url: 'https://www.figma.com/file/8tsCay2FRqctrdcZ3r9Ahw/UTRP?type=design&node-id=1579-5083&mode=dev'
        }
    },
    
    args: {
        beginningState: false,
        dummySchedules: schedules,
        dummyActiveIndex: 0,
        dummyActiveSchedule: schedules[0],
    },
};

export const Show: Story = {
    parameters: {
        design: {
            type: 'figma',
            url: 'https://www.figma.com/file/8tsCay2FRqctrdcZ3r9Ahw/UTRP?type=design&node-id=1579-5169&mode=dev'
        }
    },
    args: {
        beginningState: true,
        dummySchedules: schedules,
        dummyActiveIndex: 0,
        dummyActiveSchedule: schedules[0],
    },
};