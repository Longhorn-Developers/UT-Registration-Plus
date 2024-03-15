import { background } from '@shared/messages';
import { UserScheduleStore } from '@shared/storage/UserScheduleStore';
import type { UserSchedule } from '@shared/types/UserSchedule';
import List from '@views/components/common/List/List';
import ScheduleListItem from '@views/components/common/ScheduleListItem/ScheduleListItem';
import Text from '@views/components/common/Text/Text';
import useSchedules, { getActiveSchedule, switchSchedule } from '@views/hooks/useSchedules';
import React, { useEffect, useState } from 'react';

import AddSchedule from '~icons/material-symbols/add';

/**
 * Props for the CalendarSchedules component.
 */
export type Props = {
    style?: React.CSSProperties;
    dummySchedules?: UserSchedule[];
    dummyActiveIndex?: number;
};

/**
 * Renders a component that displays a list of schedules.
 *
 * @param props - The component props.
 * @returns The rendered component.
 */
export function CalendarSchedules({ style, dummySchedules, dummyActiveIndex }: Props) {
    const [activeScheduleIndex, setActiveScheduleIndex] = useState(0);
    const [newSchedule, setNewSchedule] = useState('');
    const [activeSchedule, schedules] = useSchedules();

    useEffect(() => {
        const index = schedules.findIndex(schedule => schedule.id === activeSchedule.id);
        if (index !== -1) {
            setActiveScheduleIndex(index);
        }
    }, [activeSchedule, schedules]);

    const handleKeyDown = event => {
        if (event.code === 'Enter') {
            background.createSchedule({ scheduleName: newSchedule }).then(() => {
                setNewSchedule('');
            });
        }
    };

    const handleScheduleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewSchedule(e.target.value);
    };

    const fixBuildError = {
        dummySchedules,
        dummyActiveIndex,
    };
    console.log(fixBuildError);

    return (
        <div style={{ ...style }} className='items-center'>
            <div className='m0 m-b-2 w-full flex justify-between'>
                <Text variant='h3'>MY SCHEDULES</Text>
                <div className='cursor-pointer items-center justify-center btn-transition -ml-1.5 hover:text-zinc-400'>
                    <Text variant='h3'>
                        <AddSchedule />
                    </Text>
                </div>
            </div>
            <div className='flex flex-col space-y-2.5'>
                <List
                    gap={10}
                    draggables={schedules}
                    itemKey={s => s.id}
                    onReordered={reordered => {
                        const activeSchedule = getActiveSchedule();
                        const activeIndex = reordered.findIndex(s => s.id === activeSchedule.id);

                        // don't care about the promise
                        UserScheduleStore.set('schedules', reordered);
                        UserScheduleStore.set('activeIndex', activeIndex);
                    }}
                >
                    {(schedule, handleProps) => (
                        <ScheduleListItem
                            schedule={schedule}
                            onClick={() => {
                                switchSchedule(schedule.id);
                            }}
                            dragHandleProps={handleProps}
                        />
                    )}
                </List>
                <input
                    type='text'
                    placeholder='Enter new schedule'
                    value={newSchedule}
                    onChange={handleScheduleInputChange}
                    onKeyDown={handleKeyDown}
                />
            </div>
        </div>
    );
}
