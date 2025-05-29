import type { Meta, StoryObj } from '@storybook/react';
import DiningAppPromo from '@views/components/calendar/DiningAppPromo';

export default {
    title: 'Components/Calendar/DiningAppPromo',
    component: DiningAppPromo,
    parameters: {
        layout: 'centered',
    },
} satisfies Meta<typeof DiningAppPromo>;

type Story = StoryObj<typeof DiningAppPromo>;

export const Default: Story = {};
