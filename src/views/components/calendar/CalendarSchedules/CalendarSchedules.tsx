import createSchedule from '@pages/background/lib/createSchedule';
import { UserScheduleStore } from '@shared/storage/UserScheduleStore';
import { Button } from '@views/components/common/Button/Button';
import List from '@views/components/common/List/List';
import ScheduleListItem from '@views/components/common/ScheduleListItem/ScheduleListItem';
import Text from '@views/components/common/Text/Text';
import useSchedules, { getActiveSchedule, switchSchedule } from '@views/hooks/useSchedules';
import React, { useEffect, useState } from 'react';

import AddSchedule from '~icons/material-symbols/add';

interface Props {
    style?: React.CSSProperties;
    dummySchedules?: unknown[];
    dummyActiveIndex?: number;
}

/**
 * Renders a component that displays a list of schedules.
 *
 * @param props - The component props.
 * @returns The rendered component.
 */
export function CalendarSchedules({ style, dummySchedules, dummyActiveIndex }: Props) {
    const [activeScheduleIndex, setActiveScheduleIndex] = useState<number>(0);
    // const [newSchedule, setNewSchedule] = useState('');
    const [activeSchedule, schedules] = useSchedules();

    useEffect(() => {
        const index = schedules.findIndex(schedule => schedule.id === activeSchedule.id);
        if (index !== -1) {
            setActiveScheduleIndex(index);
        }
    }, [activeSchedule, schedules]);

    // const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    //     if (event.code === 'Enter') {
    //         background.createSchedule({ scheduleName: newSchedule }).then(() => {
    //             setNewSchedule('');
    //         });
    //     }
    // };

    // const handleScheduleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     setNewSchedule(e.target.value);
    // };

    const fixBuildError = {
        dummySchedules,
        dummyActiveIndex,
    };
    console.log(fixBuildError);

    return (
        <div className='min-w-full w-0 items-center'>
            <div className='m0 m-b-2 w-full flex justify-between'>
                <Text variant='h3' className='text-nowrap'>
                    MY SCHEDULES
                </Text>
                <Button
                    variant='single'
                    color='theme-black'
                    className='h-fit p-0 btn'
                    onClick={() => createSchedule('New Schedule')}
                >
                    <AddSchedule className='h-6 w-6' />
                </Button>
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
            </div>
        </div>
    );
}
