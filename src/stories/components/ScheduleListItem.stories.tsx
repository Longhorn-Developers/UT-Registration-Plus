import { UserSchedule } from '@shared/types/UserSchedule';
import type { Meta, StoryObj } from '@storybook/react';
import ScheduleListItem from '@views/components/common/ScheduleListItem';
import useSchedules from '@views/hooks/useSchedules';
import React from 'react';

import { exampleSchedule } from '../injected/mocked';

const meta = {
    title: 'Components/Common/ScheduleListItem',
    component: ScheduleListItem,
    parameters: {
        layout: 'centered',
    },
    args: {
        schedule: exampleSchedule,
    },
    tags: ['autodocs'],
} satisfies Meta<typeof ScheduleListItem>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Active: Story = {
    render(args) {
        const [activeSchedule] = useSchedules();

        return (
            <ScheduleListItem
                {...args}
                schedule={
                    new UserSchedule({
                        ...exampleSchedule,
                        id: activeSchedule.id,
                    })
                }
            />
        );
    },
};
export const Inactive: Story = {};
