import { Meta, StoryObj } from '@storybook/react';
import CourseStatus from "@views/components/common/CourseStatus/CourseStatus"
import { Status } from "@shared/types/Course"

const meta = {
    title: 'Components/Common/CourseStatus',
    component: CourseStatus,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        status: { control: 'object' },
        size: { control: 'text' }
    },
} satisfies Meta<typeof CourseStatus>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        status: Status.WAITLISTED,
        size: 'small'
    },
};