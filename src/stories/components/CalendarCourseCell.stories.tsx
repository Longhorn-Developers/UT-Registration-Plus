import { Meta, StoryObj } from '@storybook/react';
import { Course, Status } from 'src/shared/types/Course';
import { CourseMeeting, DAY_MAP } from 'src/shared/types/CourseMeeting';
import { CourseSchedule } from 'src/shared/types/CourseSchedule';
import Instructor from 'src/shared/types/Instructor';
import CalendarCourseCell from 'src/views/components/common/CalendarCourseCell/CalendarCourseCell';

const meta = {
    title: 'Components/Common/CalendarCourseCell',
    component: CalendarCourseCell,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        course: { control: 'object' },
        meetingIdx: { control: 'number' },
        color: { control: 'color' },
    },
} satisfies Meta<typeof CalendarCourseCell>;
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
            status: Status.WAITLISTED,
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
