// Calendar.stories.tsx
import React from 'react';
import Calendar from 'src/views/components/common/CalendarGrid/CalendarGrid';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Components/Common/Calendar',
  component: Calendar,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
    tags: ['autodocs'],
  }
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};