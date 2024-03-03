import { Course, Status } from '@shared/types/Course';
import { CourseMeeting, DAY_MAP } from '@shared/types/CourseMeeting';
import { CourseSchedule } from '@shared/types/CourseSchedule';
import Instructor from '@shared/types/Instructor';
import { UserSchedule } from '@shared/types/UserSchedule';
import type { Meta, StoryObj } from '@storybook/react';
import { CalendarSchedules } from '@views/components/calendar/CalendarSchedules/CalendarSchedules';
import React from 'react';

const meta = {
    title: 'Components/Calendar/CalendarSchedules',
    component: CalendarSchedules,
    parameters: {
        layout: 'centered',
        tags: ['autodocs'],
    },
    argTypes: {
        //  dummySchedules: { control: 'object' },
        //  dummyActiveIndex: { control: 'number' },
    },
    render: (args: any) => (
        <div>
            <CalendarSchedules {...args} />
        </div>
    ),
} satisfies Meta<typeof CalendarSchedules>;

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
        hours: 0, // Add the missing 'hours' property
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
                    season: 'Spring',
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
        hours: 0, // Add the missing 'hours' property
    }),
];

export const Default: Story = {
    args: {
        //  dummySchedules: schedules,
        //  dummyActiveIndex: 0,
    },
};
