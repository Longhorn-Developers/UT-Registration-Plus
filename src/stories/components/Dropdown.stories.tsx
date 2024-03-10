import { UserScheduleStore } from '@shared/storage/UserScheduleStore';
import { UserSchedule } from '@shared/types/UserSchedule';
import type { Meta, StoryObj } from '@storybook/react';
import List from '@views/components/common/List/List';
import ScheduleDropdown from '@views/components/common/ScheduleDropdown/ScheduleDropdown';
import ScheduleListItem from '@views/components/common/ScheduleListItem/ScheduleListItem';
import useSchedules, { switchSchedule } from '@views/hooks/useSchedules';
import type { Serialized } from 'chrome-extension-toolkit';
import React from 'react';

import { exampleSchedule } from '../injected/mocked';

const schedules: UserSchedule[] = new Array(10).fill(exampleSchedule).map(
    (schedule: UserSchedule, index) =>
        new UserSchedule({
            ...schedule,
            name: `Schedule ${index + 1}`,
        })
);

UserScheduleStore.set(
    'schedules',
    schedules.reduce((acc, schedule) => {
        acc.push(schedule);
        return acc;
    }, [] as Serialized<UserSchedule>[])
);

UserScheduleStore.set('activeIndex', 0);

const meta: Meta<typeof ScheduleDropdown> = {
    title: 'Components/Common/Dropdown',
    component: ScheduleDropdown,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        defaultOpen: {
            control: {
                type: 'boolean',
            },
        },
        children: {
            control: {
                type: 'node',
            },
        },
    },
    render: (args: any) => (
        <div className='w-80'>
            <ScheduleDropdown {...args}>
                <List
                    draggableElements={schedules.map((schedule, index) => {
                        const [activeSchedule] = useSchedules();
                        return (
                            <ScheduleListItem
                                active={activeSchedule?.name === schedule.name}
                                name={schedule.name}
                                onClick={() => {
                                    switchSchedule(schedule.name);
                                }}
                            />
                        );
                    })}
                    gap={10}
                />
            </ScheduleDropdown>
        </div>
    ),
} satisfies Meta<typeof ScheduleDropdown>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Hidden: Story = {
    parameters: {
        design: {
            type: 'figma',
            url: 'https://www.figma.com/file/8tsCay2FRqctrdcZ3r9Ahw/UTRP?type=design&node-id=1579-5083&mode=dev',
        },
    },

    args: {
        defaultOpen: false,
    },
};

export const Visible: Story = {
    args: {
        defaultOpen: true,
    },
};
