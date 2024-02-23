import { Course, Status } from '@shared/types/Course';
import { CourseMeeting, DAY_MAP } from '@shared/types/CourseMeeting';
import { CourseSchedule } from '@shared/types/CourseSchedule';
import Instructor from '@shared/types/Instructor';
import { UserSchedule } from '@shared/types/UserSchedule';
import type { Meta, StoryObj } from '@storybook/react';
import Dropdown from '@views/components/common/Dropdown/Dropdown';
import ScheduleListItem from '@views/components/common/ScheduleListItem/ScheduleListItem';
import type { Serialized } from 'chrome-extension-toolkit';
import React from 'react';

const meta: Meta<typeof Dropdown> = {
    title: 'Components/Common/Dropdown',
    component: Dropdown,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        dummySchedules: { control: 'object' },
        dummyActiveIndex: { control: 'number' },
        scheduleComponents: { control: 'object' },
    },
    render: (args: any) => (
        <div className='w-80'>
            <Dropdown {...args} />
        </div>
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
                    season: 'Fall',
                },
            }),
        ],
        name: 'Main Schedule',
        hours: 0,
    } as Serialized<UserSchedule>),
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
                    season: 'Fall',
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
                    season: 'Fall',
                },
            }),
        ],
        name: 'Backup #3',
        hours: 0,
    } as Serialized<UserSchedule>),
];

export const Hidden: Story = {
    parameters: {
        design: {
            type: 'figma',
            url: 'https://www.figma.com/file/8tsCay2FRqctrdcZ3r9Ahw/UTRP?type=design&node-id=1579-5083&mode=dev',
        },
    },

    args: {
        dummySchedules: schedules,
        dummyActiveIndex: 0,
        scheduleComponents: schedules.map((schedule, index) => (
            <ScheduleListItem active={index === 0} name={schedule.name} />
        )),
    },
};
