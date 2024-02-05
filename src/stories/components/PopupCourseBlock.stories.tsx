import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Course, Status } from 'src/shared/types/Course';
import { CourseMeeting } from 'src/shared/types/CourseMeeting';
import Instructor from 'src/shared/types/Instructor';
import PopupCourseBlock from '../../views/components/common/PopupCourseBlock/PopupCourseBlock';

const exampleCourse: Course = new Course({
    courseName: 'ELEMS OF COMPTRS/PROGRAMMNG-WB',
    creditHours: 3,
    department: 'C S',
    description: [
        'Problem solving and fundamental algorithms for various applications in science, business, and on the World Wide Web, and introductory programming in a modern object-oriented programming language.',
        'Only one of the following may be counted: Computer Science 303E, 312, 312H. Credit for Computer Science 303E may not be earned after a student has received credit for Computer Science 314, or 314H. May not be counted toward a degree in computer science.',
        'May be counted toward the Quantitative Reasoning flag requirement.',
        'Designed to accommodate 100 or more students.',
        'Taught as a Web-based course.',
    ],
    flags: ['Quantitative Reasoning'],
    fullName: 'C S 303E ELEMS OF COMPTRS/PROGRAMMNG-WB',
    instructionMode: 'Online',
    instructors: [
        new Instructor({
            firstName: 'Bevo',
            lastName: 'Bevo',
            fullName: 'Bevo Bevo',
        }),
    ],
    isReserved: false,
    number: '303E',
    schedule: {
        meetings: [
            new CourseMeeting({
                days: ['Tuesday', 'Thursday'],
                endTime: 660,
                startTime: 570,
            }),
        ],
    },
    semester: {
        code: '12345',
        season: 'Spring',
        year: 2024,
    },
    status: Status.WAITLISTED,
    uniqueId: 12345,
    url: 'https://utdirect.utexas.edu/apps/registrar/course_schedule/20242/12345/',
});

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
    title: 'Components/Common/PopupCourseBlock',
    component: PopupCourseBlock,
    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
        layout: 'centered',
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: ['autodocs'],
    // More on argTypes: https://storybook.js.org/docs/api/argtypes
    args: {
        primaryColor: 'bg-emerald-300',
        secondaryColor: 'bg-emerald-500',
        whiteText: false,
        course: exampleCourse,
    },
    argTypes: {
        primaryColor: {
            description: 'background tailwind color',
            control: 'text',
        },
        secondaryColor: {
            description: 'background tailwind for drag handle and icon',
            control: 'text',
        },
        whiteText: {
            description: 'control text color',
            control: 'boolean',
        },
        course: {
            description: 'the course to show data for',
            control: 'object',
        },
    },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
    args: {},
};

export const AllVariants: Story = {
    args: {
        course: exampleCourse,
        primaryColor: 'bg-emerald-300',
        secondaryColor: 'bg-emerald-500',
        whiteText: false,
    },
    render: props => (
        <div className='flex flex-col gap-4'>
            <div className='h-10 w-2xl flex gap-4'>
                <PopupCourseBlock {...props} course={new Course({ ...exampleCourse, status: Status.OPEN })} />
                <PopupCourseBlock
                    course={new Course({ ...exampleCourse, status: Status.OPEN })}
                    primaryColor='bg-emerald-600'
                    secondaryColor='bg-emerald-800'
                    whiteText
                />
            </div>
            <div className='h-10 w-2xl flex gap-4'>
                <PopupCourseBlock {...props} course={new Course({ ...exampleCourse, status: Status.CLOSED })} />
                <PopupCourseBlock
                    course={new Course({ ...exampleCourse, status: Status.CLOSED })}
                    primaryColor='bg-emerald-600'
                    secondaryColor='bg-emerald-800'
                    whiteText
                />
            </div>
            <div className='h-10 w-2xl flex gap-4'>
                <PopupCourseBlock {...props} course={new Course({ ...exampleCourse, status: Status.WAITLISTED })} />
                <PopupCourseBlock
                    course={new Course({ ...exampleCourse, status: Status.WAITLISTED })}
                    primaryColor='bg-emerald-600'
                    secondaryColor='bg-emerald-800'
                    whiteText
                />
            </div>
            <div className='h-10 w-2xl flex gap-4'>
                <PopupCourseBlock {...props} course={new Course({ ...exampleCourse, status: Status.CANCELLED })} />
                <PopupCourseBlock
                    course={new Course({ ...exampleCourse, status: Status.CANCELLED })}
                    primaryColor='bg-emerald-600'
                    secondaryColor='bg-emerald-800'
                    whiteText
                />
            </div>
            <div className='h-10 w-2xl flex gap-4'>
                <PopupCourseBlock {...props} course={new Course({ ...exampleCourse, status: 'CONFLICT' as any })} />
                <PopupCourseBlock
                    course={new Course({ ...exampleCourse, status: 'CONFLICT' as any })}
                    primaryColor='bg-emerald-600'
                    secondaryColor='bg-emerald-800'
                    whiteText
                />
            </div>
        </div>
    ),
    parameters: {
        design: {
            type: 'figma',
            url: 'https://www.figma.com/file/8tsCay2FRqctrdcZ3r9Ahw/UTRP?type=design&node-id=1046-6714&mode=design&t=5Bjr7qGHNXmjfMTc-0',
        },
    },
};
