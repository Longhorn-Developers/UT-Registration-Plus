import React from 'react';

import { Status } from '@shared/types/Course';
import { Meta, StoryObj } from '@storybook/react';
import CourseStatus from '@views/components/common/CourseStatus/CourseStatus';

const meta = {
    title: 'Components/Common/CourseStatus',
    component: CourseStatus,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    args: {
        status: Status.WAITLISTED,
        size: 'small',
    },
    argTypes: {
        status: {
            options: Object.values(Status),
            mapping: Object.values(Status),
            control: {
                type: 'select',
                labels: Object.keys(Status),
            },
        },
        size: {
            options: ['small', 'mini'],
            control: {
                type: 'radio',
            },
        },
    },
} satisfies Meta<typeof CourseStatus>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
    render: args => (
        <div className='flex flex-col gap-4 items-center'>
            <CourseStatus {...args} size='small' />
            <CourseStatus {...args} size='mini' />
        </div>
    ),
};
