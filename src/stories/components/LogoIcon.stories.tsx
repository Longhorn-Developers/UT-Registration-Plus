import type { Meta, StoryObj } from '@storybook/react';
import { SmallLogo, LargeLogo } from '@views/components/common/LogoIcon'; // Adjust the path as necessary

const meta = {
    title: 'Components/Common/Logo',
    component: SmallLogo,
    tags: ['autodocs'],
    argTypes: {
        className: { control: 'text' },
    },
} satisfies Meta<typeof SmallLogo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Small: Story = {
    args: {
        className: '',
    },
};

export const Large: Story = {
    render: args => <LargeLogo {...args} />,
    args: {
        className: '',
    },
};
