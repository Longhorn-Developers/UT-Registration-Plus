import { UserSchedule } from '@shared/types/UserSchedule';
import React, { useEffect, useState } from 'react';
import AddSchedule from '~icons/material-symbols/add';
import List from '../List/List';
import ScheduleListItem from '../ScheduleListItem/ScheduleListItem';
import Text from '../Text/Text';

export type Props = {
    style?: React.CSSProperties;
    dummySchedules?: UserSchedule[];
    dummyActiveIndex?: number;
};

export function CalendarSchedules(props: Props) {
    const [activeScheduleIndex, setActiveScheduleIndex] = useState(props.dummyActiveIndex || 0);
    const [schedules, setSchedules] = useState(props.dummySchedules || []);

    let scheduleComponents = schedules.map((schedule, index) => (
        <div onClick={() => setActiveScheduleIndex(index)}>
            <ScheduleListItem
                active={index === activeScheduleIndex}
                name={schedule.name}
            />
        </div>
    ));

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

            <List gap={10} draggableElements={scheduleComponents} itemHeight={30} listHeight={0} listWidth={240} />
        </div>
    );
}
