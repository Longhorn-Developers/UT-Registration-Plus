import { Course, Status } from '@shared/types/Course';
import { CourseMeeting, DAY_MAP } from '@shared/types/CourseMeeting';
import { CourseSchedule } from '@shared/types/CourseSchedule';
import Instructor from '@shared/types/Instructor';
import type { Meta, StoryObj } from '@storybook/react';
import CalendarCourse from '@views/components/calendar/CalendarCourseBlock/CalendarCourseMeeting';

const meta = {
    title: 'Components/Calendar/CalendarCourseMeeting',
    component: CalendarCourse,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        course: { control: 'object' },
        meetingIdx: { control: 'number' },
        color: { control: 'color' },
        rightIcon: { control: 'object' },
    },
} satisfies Meta<typeof CalendarCourse>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        course: new Course({
            uniqueId: 123,
            number: '311C',
            fullName: "311C - Bevo's Default Course",
            courseName: "Bevo's Default Course",
            department: 'BVO',
            creditHours: 3,
            status: Status.OPEN,
            instructors: [new Instructor({ firstName: '', lastName: 'Bevo', fullName: 'Bevo' })],
            isReserved: false,
            url: '',
            flags: [],
            schedule: new CourseSchedule({
                meetings: [
                    new CourseMeeting({
                        days: [DAY_MAP.M, DAY_MAP.W, DAY_MAP.F],
                        startTime: 480,
                        endTime: 570,
                        location: {
                            building: 'UTC',
                            room: '123',
                        },
                    }),
                ],
            }),
            instructionMode: 'In Person',
            semester: {
                year: 2024,
                season: 'Spring',
            },
        }),
        meetingIdx: 0,
        color: 'red',
    },
};
