import { Meta, StoryObj } from '@storybook/react';
import CalendarGrid from 'src/views/components/calendar/CalendarGrid/CalendarGrid';
import { getCourseColors } from '@shared/util/colors';
import { CalendarGridCourse } from '@views/hooks/useFlattenedCourseSchedule';
import { Status } from '@shared/types/Course';

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
            dayIndex: 4,
            startIndex: 10,
            endIndex: 11,
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
            dayIndex: 2,
            startIndex: 5,
            endIndex: 6,
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
            startIndex: 10,
            endIndex: 12,
        },
        componentProps: {
            courseDeptAndInstr: 'Course 2',
            timeAndLocation: '10:00 AM - 11:00 AM, Room 102',
            status: Status.CLOSED,
            colors: getCourseColors('emerald', 500),
        },
    },
    {
    calendarGridPoint: {
        dayIndex: 4,
        startIndex: 10,
        endIndex: 11,
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
        startIndex: 10,
        endIndex: 12,
    },
    componentProps: {
        courseDeptAndInstr: 'Course 2',
        timeAndLocation: '10:00 AM - 11:00 AM, Room 102',
        status: Status.CLOSED,
        colors: getCourseColors('emerald', 500),
    },
    },
    {
    calendarGridPoint: {
        dayIndex: 1,
        startIndex: 10,
        endIndex: 12,
    },
    componentProps: {
        courseDeptAndInstr: 'Course 3',
        timeAndLocation: '10:00 AM - 11:00 AM, Room 102',
        status: Status.CLOSED,
        colors: getCourseColors('emerald', 500),
    },
    },
    {
    calendarGridPoint: {
        dayIndex: 1,
        startIndex: 10,
        endIndex: 12,
    },
    componentProps: {
        courseDeptAndInstr: 'Course 4',
        timeAndLocation: '10:00 AM - 11:00 AM, Room 102',
        status: Status.CLOSED,
        colors: getCourseColors('emerald', 500),
    },
    },
];

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        saturdayClass: true,
        courseCells: testData,
    },
};