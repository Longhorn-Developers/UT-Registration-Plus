import createSchedule from '@pages/background/lib/createSchedule';
import { UserScheduleStore } from '@shared/storage/UserScheduleStore';
import { Button } from '@views/components/common/Button';
import List from '@views/components/common/List';
import ScheduleListItem from '@views/components/common/ScheduleListItem';
import Text from '@views/components/common/Text/Text';
import { useEnforceScheduleLimit } from '@views/hooks/useEnforceScheduleLimit';
import useSchedules, { getActiveSchedule, switchSchedule } from '@views/hooks/useSchedules';
import React from 'react';

import AddSchedule from '~icons/material-symbols/add';

/**
 * Renders a component that displays a list of schedules.
 *
 * @param props - The component props.
 * @returns The rendered component.
 */
export function CalendarSchedules() {
    const [, schedules] = useSchedules();

    const enforceScheduleLimit = useEnforceScheduleLimit();
    const handleAddSchedule = () => {
        if (enforceScheduleLimit()) {
            createSchedule('New Schedule');
        }
    };

    return (
        <div className='min-w-full w-0 items-center'>
            <div className='m0 m-b-2 w-full flex justify-between'>
                <Text variant='h3' className='text-nowrap'>
                    MY SCHEDULES
                </Text>
                <Button variant='single' color='theme-black' className='h-fit p-0 btn' onClick={handleAddSchedule}>
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
