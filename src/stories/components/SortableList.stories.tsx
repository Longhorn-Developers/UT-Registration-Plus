import { Course, Status } from '@shared/types/Course';
import { CourseMeeting } from '@shared/types/CourseMeeting';
import Instructor from '@shared/types/Instructor';
import { tailwindColorways } from '@shared/util/storybook';
import type { Meta, StoryObj } from '@storybook/react';
import PopupCourseBlock from '@views/components/common/PopupCourseBlock';
import type { BaseItem } from '@views/components/common/SortableList';
import { SortableList } from '@views/components/common/SortableList';
import React from 'react';

const numberOfCourses = 5;

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
            core: ['Natural Science and Technology, Part I'],
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
            colors: tailwindColorways[i]!,
        });

        courses.push(course);
    }

    return courses;
};

const exampleCourses = generateCourses(numberOfCourses);

type CourseWithId = { course: Course } & BaseItem;

const meta = {
    title: 'Components/Common/SortableList',
    component: SortableList,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof SortableList<CourseWithId>>;
export default meta;

type Story = StoryObj<Meta<typeof SortableList<CourseWithId>>>;

export const Default: Story = {
    args: {
        draggables: exampleCourses.map(course => ({
            id: course.uniqueId,
            course,
        })),
        onChange: () => {},
        renderItem: ({ id, course }) => <PopupCourseBlock key={id} course={course} colors={course.colors} />,
    },
    render: args => (
        <div className='h-3xl w-3xl transform-none'>
            <SortableList {...args} />
        </div>
    ),
};
