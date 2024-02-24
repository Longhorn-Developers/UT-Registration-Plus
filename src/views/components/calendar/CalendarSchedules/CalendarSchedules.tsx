import type { UserSchedule } from '@shared/types/UserSchedule';
import React, { useState, useEffect } from 'react';
import useSchedules from 'src/views/hooks/useSchedules';
import createSchedule from 'src/pages/background/lib/createSchedule';
import AddSchedule from '~icons/material-symbols/add';
import List from '../../common/List/List';
import ScheduleListItem from '../../common/ScheduleListItem/ScheduleListItem';
import Text from '../../common/Text/Text';
import switchSchedule from 'src/pages/background/lib/switchSchedule';

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
export function CalendarSchedules(props: Props) {
    const [activeScheduleIndex, setActiveScheduleIndex] = useState(0);
    const [newSchedule, setNewSchedule] = useState('');
    const [activeSchedule, schedules] = useSchedules();

    useEffect(() => {
        const index = schedules.findIndex(schedule => schedule.name === activeSchedule.name);
        if (index !== -1) {
            setActiveScheduleIndex(index);
        }
    }, [activeSchedule, schedules]);

    const handleKeyDown = (event) => {
        if (event.code === 'Enter') {
            createSchedule(newSchedule);
            setNewSchedule(''); 
        }
    };

    const handleScheduleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewSchedule(e.target.value);
    };

    const selectItem = (index: number) => {
        setActiveScheduleIndex(index);
        switchSchedule(schedules[index].name);
    };

    const scheduleComponents = schedules.map((schedule, index) => {
        return (
            <ScheduleListItem
                active={index === activeScheduleIndex}
                name={schedule.name}
                onClick={() => selectItem(index)}
            />
        );
    });

    return (
        <div style={{ ...props.style }} className='items-center'>
            <div className='m0 m-b-2 w-full flex justify-between'>
                <Text variant='h3'>MY SCHEDULES</Text>
                <div className='cursor-pointer items-center justify-center btn-transition -ml-1.5 hover:text-zinc-400'>
                    <Text variant='h3'>
                        <AddSchedule />
                    </Text>
                </div>
            </div>
            <div className="flex flex-col space-y-2.5">
                <List gap={10} draggableElements={scheduleComponents} itemHeight={30} listHeight={30} listWidth={240} />
                <input type="text" placeholder='Enter new schedule' value={newSchedule} 
                onChange={handleScheduleInputChange} onKeyDown={handleKeyDown}/>
            </div>
        </div>
    );
}
