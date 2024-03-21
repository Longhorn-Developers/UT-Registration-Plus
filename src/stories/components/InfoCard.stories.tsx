import type { Meta, StoryObj } from '@storybook/react';
import InfoCard from '@views/components/common/InfoCard';

const meta = {
    title: 'Components/Common/InfoCard',
    component: InfoCard,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        titleText: { control: 'text' },
        bodyText: { control: 'text' },
    },
} satisfies Meta<typeof InfoCard>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        titleText: 'WAITLIST SIZE',
        bodyText: '14 Students',
    },
};
