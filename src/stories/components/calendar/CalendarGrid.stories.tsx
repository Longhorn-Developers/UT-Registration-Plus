import { Status } from '@shared/types/Course';
import type { Meta, StoryObj } from '@storybook/react';
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
        componentProps: {
            courseDeptAndInstr: 'Course 1',
            timeAndLocation: '9:00 AM - 10:00 AM, Room 101',
            status: Status.OPEN,
            blockData: {
                calendarGridPoint: {
                    dayIndex: 4,
                    startIndex: 10,
                    endIndex: 11,
                },
                componentProps: {
                    courseDeptAndInstr: 'Course 1',
                    timeAndLocation: '9:00 AM - 10:00 AM, Room 101',
                    status: Status.OPEN,
                    blockData: {} as CalendarGridCourse,
                },
                course: ExampleCourse,
                async: false,
            },
        },
        course: ExampleCourse,
        async: false,
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
            blockData: {
                calendarGridPoint: {
                    dayIndex: 2,
                    startIndex: 5,
                    endIndex: 6,
                },
                componentProps: {
                    courseDeptAndInstr: 'Course 1',
                    timeAndLocation: '9:00 AM - 10:00 AM, Room 101',
                    status: Status.OPEN,
                    blockData: {} as CalendarGridCourse,
                },
                course: ExampleCourse,
                async: false,
            },
        },
        course: ExampleCourse,
        async: false,
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
            blockData: {
                calendarGridPoint: {
                    dayIndex: 1,
                    startIndex: 10,
                    endIndex: 12,
                },
                componentProps: {
                    courseDeptAndInstr: 'Course 2',
                    timeAndLocation: '10:00 AM - 11:00 AM, Room 102',
                    status: Status.CLOSED,
                    blockData: {} as CalendarGridCourse,
                },
                course: ExampleCourse,
                async: false,
            },
        },
        course: ExampleCourse,
        async: false,
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
            blockData: {
                calendarGridPoint: {
                    dayIndex: 4,
                    startIndex: 10,
                    endIndex: 11,
                },
                componentProps: {
                    courseDeptAndInstr: 'Course 1',
                    timeAndLocation: '9:00 AM - 10:00 AM, Room 101',
                    status: Status.OPEN,
                    blockData: {} as CalendarGridCourse,
                },
                course: ExampleCourse,
                async: false,
            },
        },
        course: ExampleCourse,
        async: false,
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
            blockData: {
                calendarGridPoint: {
                    dayIndex: 1,
                    startIndex: 10,
                    endIndex: 12,
                },
                componentProps: {
                    courseDeptAndInstr: 'Course 2',
                    timeAndLocation: '10:00 AM - 11:00 AM, Room 102',
                    status: Status.CLOSED,
                    blockData: {} as CalendarGridCourse,
                },
                course: ExampleCourse,
                async: false,
            },
        },
        course: ExampleCourse,
        async: false,
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
            blockData: {
                calendarGridPoint: {
                    dayIndex: 1,
                    startIndex: 10,
                    endIndex: 12,
                },
                componentProps: {
                    courseDeptAndInstr: 'Course 3',
                    timeAndLocation: '10:00 AM - 11:00 AM, Room 102',
                    status: Status.CLOSED,
                    blockData: {} as CalendarGridCourse,
                },
                course: ExampleCourse,
                async: false,
            },
        },
        course: ExampleCourse,
        async: false,
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
            blockData: {
                calendarGridPoint: {
                    dayIndex: 1,
                    startIndex: 10,
                    endIndex: 12,
                },
                componentProps: {
                    courseDeptAndInstr: 'Course 4',
                    timeAndLocation: '10:00 AM - 11:00 AM, Room 102',
                    status: Status.CLOSED,
                    blockData: {} as CalendarGridCourse,
                },
                course: ExampleCourse,
                async: false,
            },
        },
        course: ExampleCourse,
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
