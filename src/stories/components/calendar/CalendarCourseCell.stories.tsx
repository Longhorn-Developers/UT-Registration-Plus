import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CalendarCourseCellProps } from '@views/components/calendar/CalendarCourseCell';
import CalendarCourseCell from '@views/components/calendar/CalendarCourseCell';

import { ExampleCourse } from '../PopupCourseBlock.stories';

const meta = {
    title: 'Components/Calendar/CalendarCourseCell',
    component: CalendarCourseCell,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        className: { control: { type: 'text' } },
    },
    render: (args: CalendarCourseCellProps) => (
        <div className='w-45'>
            <CalendarCourseCell {...args} />
        </div>
    ),
    args: {
        className: ExampleCourse.number,
    },
} satisfies Meta<typeof CalendarCourseCell>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        className: ExampleCourse.number,
        blockData: {
            calendarGridPoint: {
                dayIndex: 4,
                startIndex: 10,
                endIndex: 11,
            },
            course: ExampleCourse,
            timeAndLocation: ExampleCourse.schedule.meetings[0]?.getTimeString({
                separator: '–',
            }),
            async: false,
        },
    },
};

export const Variants: Story = {
    args: {
        className: ExampleCourse.number,
        blockData: {
            calendarGridPoint: {
                dayIndex: 4,
                startIndex: 10,
                endIndex: 11,
            },
            course: ExampleCourse,
            timeAndLocation: ExampleCourse.schedule.meetings[0]?.getTimeString({
                separator: '–',
            }),
            async: false,
        },
    },
};
