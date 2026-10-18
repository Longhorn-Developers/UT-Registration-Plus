import type { Meta, StoryObj } from '@storybook/react-vite';
import CalendarGrid from '@views/components/calendar/CalendarGrid';
import type { CalendarGridCourse } from '@views/hooks/useFlattenedCourseSchedule';

import { ExampleCourse } from '../PopupCourseBlock.stories';

const meta = {
    title: 'Components/Calendar/CalendarGrid',
    component: CalendarGrid,
    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
        layout: 'centered',
        tags: ['autodocs'],
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
            dayIndex: 4,
            startIndex: 10,
            endIndex: 11,
        },
        course: ExampleCourse,
        timeAndLocation: '9:00 AM - 10:00 AM, Room 101',
        async: false,
    },
    {
        calendarGridPoint: {
            dayIndex: 2,
            startIndex: 5,
            endIndex: 6,
        },
        course: ExampleCourse,
        timeAndLocation: '9:00 AM - 10:00 AM, Room 101',
        async: false,
    },
    {
        calendarGridPoint: {
            dayIndex: 1,
            startIndex: 10,
            endIndex: 12,
        },
        course: ExampleCourse,
        timeAndLocation: '10:00 AM - 11:00 AM, Room 102',
        async: false,
    },
    {
        calendarGridPoint: {
            dayIndex: 4,
            startIndex: 10,
            endIndex: 11,
        },
        course: ExampleCourse,
        timeAndLocation: '9:00 AM - 10:00 AM, Room 101',
        async: false,
    },
    {
        calendarGridPoint: {
            dayIndex: 1,
            startIndex: 10,
            endIndex: 12,
        },
        course: ExampleCourse,
        timeAndLocation: '10:00 AM - 11:00 AM, Room 102',
        async: false,
    },
    {
        calendarGridPoint: {
            dayIndex: 1,
            startIndex: 10,
            endIndex: 12,
        },
        course: ExampleCourse,
        timeAndLocation: '10:00 AM - 11:00 AM, Room 102',
        async: false,
    },
    {
        calendarGridPoint: {
            dayIndex: 1,
            startIndex: 10,
            endIndex: 12,
        },
        course: ExampleCourse,
        timeAndLocation: '10:00 AM - 11:00 AM, Room 102',
        async: false,
    },
];

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        saturdayClass: true,
        courseCells: testData,
        setCourse: () => {},
    },
};
