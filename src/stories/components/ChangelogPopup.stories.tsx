import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@views/components/common/Button';
import ChangelogPopup from '@views/components/common/ChangelogPopup';
import DialogProvider from '@views/components/common/DialogProvider/DialogProvider';
import useChangelog from '@views/hooks/useChangelog';
import React from 'react';

const meta = {
    title: 'Components/Common/ChangelogPopup',
    component: ChangelogPopup,
    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
        layout: 'centered',
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: ['autodocs'],
} satisfies Meta<typeof ChangelogPopup>;

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
    const handleOnClick = useChangelog();

    return (
        <Button variant='filled' color='ut-burntorange' onClick={handleOnClick}>
            Open Changelog Popup
        </Button>
    );
};
