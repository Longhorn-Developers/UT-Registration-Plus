import type { Meta, StoryObj } from '@storybook/react';
import ImportantLinks from '@views/components/calendar/ImportantLinks';

const meta = {
    title: 'Components/Common/ImportantLinks',
    component: ImportantLinks,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {},
} satisfies Meta<typeof ImportantLinks>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {},
};
