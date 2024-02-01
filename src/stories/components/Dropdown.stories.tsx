import Dropdown from 'src/views/components/common/Dropdown/Dropdown';
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

/*
    TODO: add Isaiah's figma into the storybook
    
*/

const meta: Meta<typeof Dropdown> = {
    title: 'Components/Common/Dropdown',
    component: Dropdown,
    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
        layout: 'centered',
      },
      // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
      tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

export const Hidden: Story = {
    name: 'Hidden',
    render: () => <Dropdown />
};

export const Show: Story = {
    name: 'Show',
};