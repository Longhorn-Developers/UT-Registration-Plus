import type { DraggableProvidedDragHandleProps } from '@hello-pangea/dnd';
import { Course, Status } from '@shared/types/Course';
import { CourseMeeting } from '@shared/types/CourseMeeting';
import Instructor from '@shared/types/Instructor';
import type { CourseColors } from '@shared/util/colors';
import { tailwindColorways } from '@shared/util/storybook';
import type { Meta, StoryObj } from '@storybook/react';
import List from '@views/components/common/List/List';
import PopupCourseBlock from '@views/components/common/PopupCourseBlock/PopupCourseBlock';
import React from 'react';

const numberOfCourses = 5;

// TODO: move into utils
/**
 * Generates an array of courses.
 *
 * @param count - The number of courses to generate.
 * @returns An array of generated courses.
 */
const generateCourses = (count: number): Course[] => {
    const courses = [];

    for (let i = 0; i < count; i++) {
        const course = new Course({
            courseName: 'ELEMS OF COMPTRS/PROGRAMMNG-WB',
            creditHours: 3,
            department: 'C S',
            scrapedAt: Date.now(),
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
const generateCourseBlocks = (
    { course, colors }: { course: Course; colors: CourseColors },
    dragHandleProps: DraggableProvidedDragHandleProps
) => <PopupCourseBlock key={course.uniqueId} course={course} colors={colors} dragHandleProps={dragHandleProps} />;

const meta = {
    title: 'Components/Common/List',
    component: List,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        gap: { control: 'number' },
    },
} satisfies Meta<typeof List>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        draggables: exampleCourses.map((course, i) => ({ course, colors: tailwindColorways[i] })),
        children: generateCourseBlocks,
        gap: 12,
    },
    render: args => (
        <div className='w-sm'>
            <List {...args} />
        </div>
    ),
};
