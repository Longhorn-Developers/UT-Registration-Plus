import { Course, Status } from '@shared/types/Course';
import { CourseMeeting } from '@shared/types/CourseMeeting';
import Instructor from '@shared/types/Instructor';
import { getCourseColors } from '@shared/util/colors';
import type { Meta, StoryObj } from '@storybook/react';
import PopupCourseBlock from '@views/components/common/PopupCourseBlock/PopupCourseBlock';
import React from 'react';
import { theme } from 'unocss/preset-mini';

/**
 * Represents an example course.
 *
 * @remarks
 * This is a sample course object that provides information about a specific course.
 */
export const ExampleCourse: Course = new Course({
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
        colors: getCourseColors('emerald'),
        course: ExampleCourse,
    },
    argTypes: {
        colors: {
            description: 'the colors to use for the course block',
            control: 'object',
        },
        course: {
            description: 'the course to show data for',
            control: 'object',
        },
    },
} satisfies Meta<typeof PopupCourseBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
    args: {},
};

export const Variants: Story = {
    render: props => (
        <div className='grid grid-cols-2 max-w-2xl w-90vw gap-x-4 gap-y-2'>
            <PopupCourseBlock {...props} course={new Course({ ...ExampleCourse, status: Status.OPEN })} />
            <PopupCourseBlock {...props} course={new Course({ ...ExampleCourse, status: Status.CLOSED })} />
            <PopupCourseBlock {...props} course={new Course({ ...ExampleCourse, status: Status.WAITLISTED })} />
            <PopupCourseBlock {...props} course={new Course({ ...ExampleCourse, status: Status.CANCELLED })} />
        </div>
    ),
};

export const TestColors = Object.keys(theme.colors)
    // check that the color is a colorway (is an object)
    .filter(color => typeof theme.colors[color] === 'object')
    .slice(0, 17)
    .map(color => getCourseColors(color as keyof typeof theme.colors));

export const AllColors: Story = {
    render: props => (
        <div className='grid grid-flow-col grid-cols-2 grid-rows-9 max-w-2xl w-90vw gap-x-4 gap-y-2'>
            {TestColors.map((color, i) => (
                <PopupCourseBlock key={color.primaryColor} course={ExampleCourse} colors={color} />
            ))}
        </div>
    ),
    parameters: {
        design: {
            type: 'figma',
            url: 'https://www.figma.com/file/8tsCay2FRqctrdcZ3r9Ahw/UTRP?type=design&node-id=1046-6714&mode=design&t=5Bjr7qGHNXmjfMTc-0',
        },
    },
};
