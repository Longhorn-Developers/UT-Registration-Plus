import { UserScheduleStore } from '@shared/storage/UserScheduleStore';
import { UserSchedule } from '@shared/types/UserSchedule';
import { generateRandomId } from '@shared/util/random';
import type { Meta, StoryObj } from '@storybook/react';
import type { ScheduleDropdownProps } from '@views/components/common/ScheduleDropdown';
import ScheduleDropdown from '@views/components/common/ScheduleDropdown';
import ScheduleListItem from '@views/components/common/ScheduleListItem';
import { SortableList } from '@views/components/common/SortableList';
import useSchedules, { getActiveSchedule, switchSchedule } from '@views/hooks/useSchedules';
import type { Serialized } from 'chrome-extension-toolkit';
import React, { useEffect } from 'react';

import { exampleSchedule } from '../injected/mocked';

const schedules: UserSchedule[] = new Array(10).fill(exampleSchedule).map(
    (schedule: UserSchedule, index) =>
        new UserSchedule({
            ...schedule,
            id: generateRandomId(),
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
    render: (args: ScheduleDropdownProps) => {
        const [activeSchedule, schedules] = useSchedules();

        useEffect(() => {
            console.log(activeSchedule);
        }, [activeSchedule]);

        return (
            <div className='w-80'>
                <ScheduleDropdown {...args}>
                    <SortableList
                        className='gap-spacing-3'
                        draggables={schedules}
                        onChange={reordered => {
                            const activeSchedule = getActiveSchedule();
                            const activeIndex = reordered.findIndex(s => s.id === activeSchedule.id);

                            // don't care about the promise
                            UserScheduleStore.set('schedules', reordered);
                            UserScheduleStore.set('activeIndex', activeIndex);
                        }}
                        renderItem={schedule => (
                            <ScheduleListItem schedule={schedule} onClick={() => switchSchedule(schedule.id)} />
                        )}
                    />
                </ScheduleDropdown>
            </div>
        );
    },
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
