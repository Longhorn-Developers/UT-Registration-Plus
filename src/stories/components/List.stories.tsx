import { Course, Status } from '@shared/types/Course';
import { CourseMeeting } from '@shared/types/CourseMeeting';
import Instructor from '@shared/types/Instructor';
import { Meta, StoryObj } from '@storybook/react';
import List from '@views/components/common/List/List';
import PopupCourseBlock from '@views/components/common/PopupCourseBlock/PopupCourseBlock';
import React from 'react';
import { test_colors } from './PopupCourseBlock.stories';

const numberOfCourses = 5;

const generateCourses = count => {
    const courses = [];

    for (let i = 0; i < count; i++) {
        const course = new Course({
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
            uniqueId: 12345 + i, // Make uniqueId different for each course
            url: 'https://utdirect.utexas.edu/apps/registrar/course_schedule/20242/12345/',
        });

        courses.push(course);
    }

    return courses;
};

const exampleCourses = generateCourses(numberOfCourses);
const generateCourseBlocks = (exampleCourses, colors) =>
    exampleCourses.map((course, i) => <PopupCourseBlock key={course.uniqueId} course={course} colors={colors[i]} />);
const exampleCourseBlocks = generateCourseBlocks(exampleCourses, test_colors);

const meta = {
    title: 'Components/Common/List',
    component: List,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        draggableElements: { control: 'object' },
        itemHeight: { control: 'number' },
        listHeight: { control: 'number' },
        listWidth: { control: 'number' },
        gap: { control: 'number' },
    },
} satisfies Meta<typeof List>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        draggableElements: exampleCourseBlocks,
        itemHeight: 55,
        listHeight: 300,
        listWidth: 300,
        gap: 12,
    },
};
