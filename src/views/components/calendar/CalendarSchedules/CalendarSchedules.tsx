import createSchedule from '@pages/background/lib/createSchedule';
import switchSchedule from '@pages/background/lib/switchSchedule';
import type { UserSchedule } from '@shared/types/UserSchedule';
import List from '@views/components/common/List/List';
import ScheduleListItem from '@views/components/common/ScheduleListItem/ScheduleListItem';
import Text from '@views/components/common/Text/Text';
import useSchedules from '@views/hooks/useSchedules';
import React, { useEffect, useState } from 'react';

import AddSchedule from '~icons/material-symbols/add';

/**
 * Props for the CalendarSchedules component.
 */
export type Props = {
    style?: React.CSSProperties;
};

/**
 * Renders a component that displays a list of schedules.
 *
 * @param props - The component props.
 * @returns The rendered component.
 */
export function CalendarSchedules() {
    const [newSchedule, setNewSchedule] = useState('');
    const [activeSchedule, schedules, activeIndex] = useSchedules();
    const [scheduleComponents, setScheduleComponents] = useState<JSX.Element[]>([]);

    const handleKeyDown = (e) => {
        if (e.code === 'Enter') {
            createSchedule(newSchedule);
            setNewSchedule('');
        }
    };

    const handleScheduleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewSchedule(e.target.value);
    };

    const selectItem = (index: number) => {
        switchSchedule(schedules[index].name);
    };

    useEffect(() =>
        setScheduleComponents(schedules.map((schedule, index) => {
            return (
                <ScheduleListItem
                    key={`${schedule.name}-${index}`} 
                    index={index}
                    name={schedule.name + activeIndex}
                    onClick={() => selectItem(index)}
                />
            );
        })), [schedules]);

    return (
        <div className='items-center'>
            <div className='m0 m-b-2 w-full flex justify-between'>
                <Text variant='h3'>MY SCHEDULES</Text>
                <div className='cursor-pointer items-center justify-center btn-transition -ml-1.5 hover:text-zinc-400'>
                    <Text variant='h3'>
                        <AddSchedule />
                    </Text>
                </div>
            </div>
            <div className='flex flex-col space-y-2.5'>
                <List gap={10} draggableElements={scheduleComponents} />
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
