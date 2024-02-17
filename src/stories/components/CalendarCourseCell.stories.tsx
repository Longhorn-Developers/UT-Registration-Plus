import { Course, Status } from '@shared/types/Course';
import { getCourseColors } from '@shared/util/colors';
import { Meta, StoryObj } from '@storybook/react';
import CalendarCourseCell from '@views/components/common/CalendarCourseCell/CalendarCourseCell';
import React from 'react';
import { exampleCourse } from './PopupCourseBlock.stories';

const meta = {
    title: 'Components/Common/CalendarCourseCell',
    component: CalendarCourseCell,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        department: { control: { type: 'text' } },
        courseNumber: { control: { type: 'text' } },
        instructorLastName: { control: { type: 'text' } },
        status: { control: { type: 'select', options: Object.values(Status) } },
        meetingTime: { control: { type: 'text' } },
        colors: { control: { type: 'object' } },
    },
    render: (args: any) => (
        <div className='w-45'>
            <CalendarCourseCell {...args} />
        </div>
    ),
    args: {
        department: exampleCourse.department,
        courseNumber: exampleCourse.number,
        instructorLastName: exampleCourse.instructors[0].lastName,
        status: exampleCourse.status,
        meetingTime: exampleCourse.schedule.meetings[0].getTimeString({ separator: '-' }),

        colors: getCourseColors('emerald', 500),
    },
} satisfies Meta<typeof CalendarCourseCell>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        course: new Course({
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
        meetingIdx: 0,
        color: 'red',
    },
};
