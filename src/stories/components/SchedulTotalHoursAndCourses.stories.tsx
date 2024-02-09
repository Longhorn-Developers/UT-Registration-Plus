import { Meta, StoryObj } from '@storybook/react';
import ScheduleTotalHoursAndCourses from '@views/components/common/ScheduleTotalHoursAndCourses/ScheduleTotalHoursAndCourses';

const meta = {
    title: 'Components/Common/ScheduleTotalHoursAndCourses',
    component: ScheduleTotalHoursAndCourses,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        scheduleName: { control: 'text' },
        totalHours: { control: 'number' },
        totalCourses: { control: 'number' }
    },
} satisfies Meta<typeof ScheduleTotalHoursAndCourses>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        scheduleName: 'text',
        totalHours: 22,
        totalCourses: 8
    },
};