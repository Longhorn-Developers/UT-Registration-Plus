import { Meta, StoryObj } from '@storybook/react';
import CalendarGrid from 'src/views/components/calendar/CalendarGrid/CalendarGrid';
import { getCourseColors } from 'src/shared/util/colors';
import { CalendarGridCourse } from 'src/views/hooks/useFlattenedCourseSchedule';
import { Status } from 'src/shared/types/Course';

const meta = {
    title: 'Components/Common/Calendar',
    component: Calendar,
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
