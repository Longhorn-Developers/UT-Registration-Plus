import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@views/components/common/Button';
import DialogProvider from '@views/components/common/DialogProvider/DialogProvider';
import WhatsNewPopup from '@views/components/common/WhatsNewPopup';
import useWhatsNewPopUp from '@views/hooks/useWhatsNew';
import React from 'react';

const meta = {
    title: 'Components/Common/WhatsNewPopup',
    component: WhatsNewPopup,
    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
        layout: 'centered',
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: ['autodocs'],
} satisfies Meta<typeof WhatsNewPopup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    render: () => (
        <DialogProvider>
            <InnerComponent />
        </DialogProvider>
    ),
};

const InnerComponent = () => {
    const handleOnClick = useWhatsNewPopUp();

    return (
        <Button color='ut-burntorange' onClick={handleOnClick}>
            Open Dialog
        </Button>
    );
};
