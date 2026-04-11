import createSchedule from '@pages/background/lib/createSchedule';
import { UserScheduleStore } from '@shared/storage/UserScheduleStore';
import { Button } from '@views/components/common/Button';
import ScheduleListItem from '@views/components/common/ScheduleListItem';
import { SortableList } from '@views/components/common/SortableList';
import Text from '@views/components/common/Text/Text';
import { useEnforceScheduleLimit } from '@views/hooks/useEnforceScheduleLimit';
import { getActiveSchedule, switchSchedule, useAllSchedules } from '@views/hooks/useSchedules';
import { memo } from 'react';
import PlusIcon from '~icons/ph/plus';

/**
 * Renders a component that displays a list of schedules.
 *
 * @param props - The component props.
 * @returns The rendered component.
 */
export const CalendarSchedules = memo(function CalendarSchedules() {
    const schedules = useAllSchedules();

    const enforceScheduleLimit = useEnforceScheduleLimit();
    const handleAddSchedule = () => {
        if (enforceScheduleLimit()) {
            createSchedule('New Schedule');
        }
    };

    return (
        <div className='min-w-full w-0 flex flex-col items-center gap-y-spacing-2'>
            <div className='m0 w-full flex items-center justify-between sticky top-0 z-10 bg-white pt-1'>
                <Text variant='h3' className='text-nowrap text-theme-black'>
                    MY SCHEDULES
                </Text>
                <Button
                    variant='minimal'
                    size='small'
                    color='theme-black'
                    className='!p-0 btn'
                    onClick={handleAddSchedule}
                    icon={PlusIcon}
                />
            </div>
            <div className='w-full flex flex-col'>
                <SortableList
                    className='gap-spacing-3'
                    draggables={schedules}
                    onChange={reordered => {
                        const activeSchedule = getActiveSchedule();
                        const activeIndex = reordered.findIndex(s => s.id === activeSchedule.id);

                        UserScheduleStore.set({ schedules: reordered, activeIndex });
                    }}
                    renderItem={schedule => (
                        <ScheduleListItem schedule={schedule} onClick={() => switchSchedule(schedule.id)} />
                    )}
                />
            </div>
        </div>
    );
});
