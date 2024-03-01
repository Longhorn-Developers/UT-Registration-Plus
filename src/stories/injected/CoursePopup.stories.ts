import { Course, Status } from '@shared/types/Course';
import { UserSchedule } from '@shared/types/UserSchedule';
import type { Meta, StoryObj } from '@storybook/react';
import CoursePopup from '@views/components/injected/CoursePopupOld/CoursePopup';

import { exampleCourse, exampleSchedule } from './mocked';

const meta = {
    title: 'Components/Injected/CoursePopup',
    component: CoursePopup,
    // tags: ['autodocs'],
    args: {
        course: exampleCourse,
        activeSchedule: exampleSchedule,
    },
    argTypes: {
        course: {
            control: {
                type: 'other',
            },
        },
        activeSchedule: {
            control: {
                type: 'other',
            },
        },
    },
    parameters: {
        design: {
            type: 'figma',
            url: 'https://www.figma.com/file/8tsCay2FRqctrdcZ3r9Ahw/UTRP?type=design&node-id=602-1879&mode=design&t=BoS5xBrpSsjgQXqv-11',
        },
    },
} satisfies Meta<typeof CoursePopup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {
    args: {
        course: new Course({ ...exampleCourse, status: Status.OPEN }),
        activeSchedule: new UserSchedule({
            courses: [],
            name: 'Example Schedule',
            hours: 0,
        }),
    },
};

export const Closed: Story = {
    args: {
        course: new Course({ ...exampleCourse, status: Status.CLOSED }),
    },
};

export const Cancelled: Story = {
    args: {
        course: new Course({ ...exampleCourse, status: Status.CANCELLED }),
    },
};
