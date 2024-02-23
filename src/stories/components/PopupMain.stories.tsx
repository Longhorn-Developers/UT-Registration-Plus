import type { Meta, StoryObj } from '@storybook/react';
import PopupMain from '@views/components/PopupMain';

const meta = {
    title: 'Components/Common/PopupMain',
    component: PopupMain,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {},
} satisfies Meta<typeof PopupMain>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {},
};
