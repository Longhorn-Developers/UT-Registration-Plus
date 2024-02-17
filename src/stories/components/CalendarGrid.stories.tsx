import { Meta, StoryObj } from '@storybook/react';
import CalendarGrid from 'src/views/components/common/CalendarGrid/CalendarGrid';
import { getCourseColors } from 'src/shared/util/colors';
import { CalendarGridCourse } from 'src/views/hooks/useFlattenedCourseSchedule';
import { Status } from 'src/shared/types/Course';

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
          startIndex: 4,
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
          dayIndex: 4,
          startIndex: 10,
          endIndex: 20,
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