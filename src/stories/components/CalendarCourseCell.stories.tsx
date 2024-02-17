import { Course, Status } from '@shared/types/Course';
import { getCourseColors } from '@shared/util/colors';
import { Meta, StoryObj } from '@storybook/react';
import CalendarCourseCell from '@views/components/common/CalendarCourseCell/CalendarCourseCell';
import React from 'react';
import { exampleCourse } from './PopupCourseBlock.stories';

const meta = {
    title: 'Components/Common/CalendarCourseCell',
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
        colors: { control: { type: 'object' } },
    },
    render: (args: any) => (
        <div className='w-45'>
            <CalendarCourseCell {...args} />
        </div>
    ),
    args: {
        courseDeptAndInstr: exampleCourse.department,
        className: exampleCourse.number,
        status: exampleCourse.status,
        timeAndLocation: exampleCourse.schedule.meetings[0].getTimeString({ separator: '-' }),

        colors: getCourseColors('emerald', 500),
    },
} satisfies Meta<typeof CalendarCourseCell>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
    render: props => (
        <div className='grid grid-cols-2 h-40 max-w-60 w-90vw gap-x-4 gap-y-2'>
            <CalendarCourseCell
                {...props}
                // course={new Course({ ...exampleCourse, status: Status.OPEN })}
                // Course = new Course({
                //     courseName: 'PRINCIPLES OF COMPUTER SYSTEMS',
                //     creditHours: 3,
                //     department: 'C S',
                //     description: [
                //         'Restricted to computer science majors.',
                //         'An introduction to computer systems software abstractions with an emphasis on the connection of these abstractions to underlying computer hardware. Key abstractions include threads, virtual memory, protection, and I/O. Requires writing of synchronized multithreaded programs and pieces of an operating system.',
                //         'Computer Science 439 and 439H may not both be counted.',
                //         'Prerequisite: Computer Science 429, or 429H with a grade of at least C-.',
                //         'May be counted toward the Independent Inquiry flag requirement.',
                //     ],
                //     flags: ['Independent Inquiry'],
                //     fullName: 'C S 439 PRINCIPLES OF COMPUTER SYSTEMS',
                //     instructionMode: 'In Person',
                //     instructors: [
                //         new Instructor({
                //             firstName: 'Allison',
                //             lastName: 'Norman',
                //             fullName: 'Allison Norman',
                //         }),
                //     ],
                //     isReserved: false,
                //     number: '439',
                //     schedule: {
                //         meetings: [
                //             new CourseMeeting({
                //                 days: ['Tuesday', 'Thursday'],
                //                 startTime: 930,
                //                 endTime: 1050,
                //             }),
                //             new CourseMeeting({
                //                 days: ['Friday'],
                //                 startTime: 600,
                //                 endTime: 720,
                //             }),
                //         ],
                //     },
                //     semester: {
                //         code: '12345',
                //         season: 'Spring',
                //         year: 2024,
                //     },
                //     status: Status.WAITLISTED,
                //     uniqueId: 67890,
                //     url: 'https://utdirect.utexas.edu/apps/registrar/course_schedule/20242/12345/',
                // });
                
                colors={getCourseColors('green', 500)}
            />
            <CalendarCourseCell
                {...props}
                // course={new Course({ ...exampleCourse, status: Status.CLOSED })}
                colors={getCourseColors('teal', 400)}
            />
            <CalendarCourseCell
                {...props}
                // course={new Course({ ...exampleCourse, status: Status.WAITLISTED })}
                colors={getCourseColors('indigo', 400)}
            />
            <CalendarCourseCell
                {...props}
                // course={new Course({ ...exampleCourse, status: Status.CANCELLED })}
                colors={getCourseColors('red', 500)}
            />
        </div>
    ),
};
