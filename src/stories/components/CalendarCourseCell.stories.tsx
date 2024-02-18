import { Course, Status } from '@shared/types/Course';
import { getCourseColors } from '@shared/util/colors';
import type { Meta, StoryObj } from '@storybook/react';
import CalendarCourseCell from '@views/components/common/CalendarCourseCell/CalendarCourseCell';
import React from 'react';

import { ExampleCourse } from './PopupCourseBlock.stories';

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
        department: ExampleCourse.department,
        courseNumber: ExampleCourse.number,
        instructorLastName: ExampleCourse.instructors[0].lastName,
        status: ExampleCourse.status,
        meetingTime: ExampleCourse.schedule.meetings[0].getTimeString({ separator: '-' }),

        colors: getCourseColors('emerald', 500),
    },
} satisfies Meta<typeof CalendarCourseCell>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
    render: props => (
        <div className='grid grid-cols-2 h-40 max-w-60 w-90vw gap-x-4 gap-y-2'>
            <CalendarCourseCell
                {...props}
                course={new Course({ ...ExampleCourse, status: Status.OPEN })}
                colors={getCourseColors('green', 500)}
            />
            <CalendarCourseCell
                {...props}
                course={new Course({ ...ExampleCourse, status: Status.CLOSED })}
                colors={getCourseColors('teal', 400)}
            />
            <CalendarCourseCell
                {...props}
                course={new Course({ ...ExampleCourse, status: Status.WAITLISTED })}
                colors={getCourseColors('indigo', 400)}
            />
            <CalendarCourseCell
                {...props}
                course={new Course({ ...ExampleCourse, status: Status.CANCELLED })}
                colors={getCourseColors('red', 500)}
            />
        </div>
    ),
};
