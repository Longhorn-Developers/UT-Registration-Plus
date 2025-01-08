import createSchedule from '@pages/background/lib/createSchedule';
import { Plus } from '@phosphor-icons/react';
import { UserScheduleStore } from '@shared/storage/UserScheduleStore';
import { getSpacingInPx } from '@shared/types/Spacing';
import { Button } from '@views/components/common/Button';
import List from '@views/components/common/List';
import ScheduleListItem from '@views/components/common/ScheduleListItem';
import Text from '@views/components/common/Text/Text';
import { useEnforceScheduleLimit } from '@views/hooks/useEnforceScheduleLimit';
import useSchedules, { getActiveSchedule, switchSchedule } from '@views/hooks/useSchedules';
import React from 'react';

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
        <div className='min-w-full w-0 flex flex-col items-center gap-y-spacing-3'>
            <div className='m0 w-full flex justify-between'>
                <Text variant='h3' className='text-nowrap text-theme-black'>
                    MY SCHEDULES
                </Text>
                <Button
                    variant='minimal'
                    color='theme-black'
                    className='h-fit w-fit !p-0 btn'
                    onClick={handleAddSchedule}
                    icon={Plus}
                />
            </div>
            <div className='w-full flex flex-col'>
                <List
                    gap={getSpacingInPx('spacing-3')}
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
