import { Status } from '@shared/types/Course';
import type { Meta, StoryObj } from '@storybook/react';
import type { CalendarCourseCellProps } from '@views/components/calendar/CalendarCourseCell';
import CalendarCourseCell from '@views/components/calendar/CalendarCourseCell';
import type { CalendarGridCourse } from '@views/hooks/useFlattenedCourseSchedule';
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
    },
} satisfies Meta<typeof CalendarCourseCell>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        courseDeptAndInstr: ExampleCourse.department,
        className: ExampleCourse.number,
        status: ExampleCourse.status,
        timeAndLocation: ExampleCourse.schedule.meetings[0]!.getTimeString({ separator: '-' }),
        blockData: {
            calendarGridPoint: {
                dayIndex: 4,
                startIndex: 10,
                endIndex: 11,
            },
            course: ExampleCourse,
            async: false,
            componentProps: {
                courseDeptAndInstr: ExampleCourse.department,
                status: ExampleCourse.status,
                timeAndLocation: ExampleCourse.schedule.meetings[0]!.getTimeString({ separator: '-' }),
                blockData: {} as CalendarGridCourse,
            },
        },
    },
};

export const Variants: Story = {
    args: {
        courseDeptAndInstr: ExampleCourse.department,
        className: ExampleCourse.number,
        status: ExampleCourse.status,
        timeAndLocation: ExampleCourse.schedule.meetings[0]!.getTimeString({ separator: '-' }),
        blockData: {
            calendarGridPoint: {
                dayIndex: 4,
                startIndex: 10,
                endIndex: 11,
            },
            course: ExampleCourse,
            async: false,
            componentProps: {
                courseDeptAndInstr: ExampleCourse.department,
                status: ExampleCourse.status,
                timeAndLocation: ExampleCourse.schedule.meetings[0]!.getTimeString({ separator: '-' }),
                blockData: {
                    calendarGridPoint: {
                        dayIndex: 4,
                        startIndex: 10,
                        endIndex: 11,
                    },
                    componentProps: {
                        courseDeptAndInstr: ExampleCourse.department,
                        status: ExampleCourse.status,
                        timeAndLocation: ExampleCourse.schedule.meetings[0]!.getTimeString({ separator: '-' }),
                        blockData: {} as CalendarGridCourse,
                    },
                    course: ExampleCourse,
                    async: false,
                },
            },
        },
    },
};
