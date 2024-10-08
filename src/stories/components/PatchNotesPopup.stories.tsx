import type { Meta, StoryObj } from '@storybook/react';
import PatchNotesPopup from '@views/components/common/PatchNotesPopup';
import React from 'react';

const meta = {
    title: 'Components/Common/PatchNotesPopup',
    component: PatchNotesPopup,
    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
        layout: 'centered',
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: ['autodocs'],
} satisfies Meta<typeof PatchNotesPopup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        isOpen: true,
        onClose: () => {},
    },
    render: props => (
        <div className='h-screen w-screen bg-white'>
            <PatchNotesPopup {...props} />
        </div>
    ),
};
