import type { Meta, StoryObj } from '@storybook/react';
import { Status } from 'src/shared/types/Course';
import { getCourseColors } from 'src/shared/util/colors';
import CalendarGrid from 'src/views/components/common/CalendarGrid/CalendarGrid';
import type { CalendarGridCourse } from 'src/views/hooks/useFlattenedCourseSchedule';

const meta = {
    title: 'Components/Common/CalendarGrid',
    component: CalendarGrid,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        saturdayClass: { control: 'boolean' },
    },
} satisfies Meta<typeof CalendarGrid>;
export default meta;

const testData: CalendarGridCourse[] = [
    {
        calendarGridPoint: {
            dayIndex: 0,
            startIndex: 1,
            endIndex: 2,
        },
        componentProps: {
            courseDeptAndInstr: 'Course 1',
            timeAndLocation: '9:00 AM - 10:00 AM, Room 101',
            status: Status.OPEN,
            colors: getCourseColors('emerald', 500),
        },
    },
    {
        calendarGridPoint: {
            dayIndex: 1,
            startIndex: 2,
            endIndex: 3,
        },
        componentProps: {
            courseDeptAndInstr: 'Course 2',
            timeAndLocation: '10:00 AM - 11:00 AM, Room 102',
            status: Status.CLOSED,
            colors: getCourseColors('emerald', 500),
        },
    },
    // add more data as needed
];

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        saturdayClass: true,
        courseCells: testData,
    },
};
