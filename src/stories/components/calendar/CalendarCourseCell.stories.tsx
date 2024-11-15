import { Status } from '@shared/types/Course';
import { getCourseColors } from '@shared/util/colors';
import type { Meta, StoryObj } from '@storybook/react';
import type { CalendarCourseCellProps } from '@views/components/calendar/CalendarCourseCell';
import CalendarCourseCell from '@views/components/calendar/CalendarCourseCell';
import React from 'react';

import { ExampleCourse } from '../PopupCourseBlock.stories';

const meta = {
    title: 'Components/Calendar/CalendarCourseCell',
    component: CalendarCourseCell,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        courseDeptAndInstr: { control: { type: 'text' } },
        className: { control: { type: 'text' } },
        status: { control: { type: 'select', options: Object.values(Status) } },
        timeAndLocation: { control: { type: 'text' } },
        colors: { control: { type: 'object' } },
    },
    render: (args: CalendarCourseCellProps) => (
        <div className='w-45'>
            <CalendarCourseCell {...args} />
        </div>
    ),
    args: {
        courseDeptAndInstr: ExampleCourse.department,
        className: ExampleCourse.number,
        status: ExampleCourse.status,
        timeAndLocation: ExampleCourse.schedule.meetings[0]!.getTimeString({ separator: '–' }),

        colors: getCourseColors('emerald', 500),
    },
} satisfies Meta<typeof CalendarCourseCell>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
    render: props => (
        <div className='grid grid-cols-2 h-40 max-w-60 w-90vw gap-x-4 gap-y-2'>
            <CalendarCourseCell {...props} colors={getCourseColors('green', 500)} />
            <CalendarCourseCell {...props} colors={getCourseColors('teal', 400)} />
            <CalendarCourseCell {...props} colors={getCourseColors('indigo', 400)} />
            <CalendarCourseCell {...props} colors={getCourseColors('red', 500)} />
        </div>
    ),
};
