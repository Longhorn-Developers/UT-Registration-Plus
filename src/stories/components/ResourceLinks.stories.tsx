import type { Meta, StoryObj } from '@storybook/react-vite';
import ResourceLinks from '@views/components/calendar/ResourceLinks';

const meta = {
    title: 'Components/Common/ResourceLinks',
    component: ResourceLinks,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {},
} satisfies Meta<typeof ResourceLinks>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {},
};
