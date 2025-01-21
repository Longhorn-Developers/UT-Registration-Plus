import { BookmarkSimple, Export, MapPinArea, PlusCircle, SelectionPlus, Sidebar } from '@phosphor-icons/react';
import styles from '@views/components/calendar/CalendarHeader/CalendarHeader.module.scss';
import { Button } from '@views/components/common/Button';
import Divider from '@views/components/common/Divider';
import ScheduleTotalHoursAndCourses from '@views/components/common/ScheduleTotalHoursAndCourses';
import useSchedules from '@views/hooks/useSchedules';
import clsx from 'clsx';
import React from 'react';

interface CalendarHeaderProps {
    sidebarOpen?: boolean;
    onSidebarToggle?: () => void;
}

/**
 * Renders the header component for the calendar.
 * @returns The JSX element representing the calendar header.
 */
export default function CalendarHeader({ sidebarOpen, onSidebarToggle }: CalendarHeaderProps): JSX.Element {
    const [activeSchedule] = useSchedules();

    return (
        <div className='min-h-[91px] flex items-center gap-5 overflow-x-auto overflow-y-hidden py-5 pl-6 md:overflow-x-hidden'>
            {!sidebarOpen && (
                <Button
                    variant='minimal'
                    color='theme-black'
                    onClick={onSidebarToggle}
                    className='h-fit w-fit screenshot:hidden !p-0'
                    icon={Sidebar}
                />
            )}

            <div className='min-w-[10.9375rem] screenshot:transform-origin-left screenshot:scale-120'>
                <ScheduleTotalHoursAndCourses
                    scheduleName={activeSchedule.name}
                    totalHours={activeSchedule.hours}
                    totalCourses={activeSchedule.courses.length}
                />
            </div>
            <Divider className='self-center screenshot:hidden' size='1.75rem' orientation='vertical' />
            <div className={clsx(styles.cqInline, 'flex flex-1 gap-5')}>
                <div className={clsx(styles.primaryActions, 'min-w-fit flex gap-5')}>
                    <Button color='ut-black' size='small' variant='minimal' icon={PlusCircle}>
                        Quick Add
                    </Button>
                    <Button color='ut-black' size='small' variant='minimal' icon={SelectionPlus}>
                        Block
                    </Button>
                    <Button color='ut-black' size='small' variant='minimal' icon={Export}>
                        Export
                    </Button>
                </div>
                <Divider className='self-center screenshot:hidden' size='1.75rem' orientation='vertical' />
                <div className={clsx(styles.secondaryActions, 'mr-5 min-w-fit flex flex-1 justify-end gap-5')}>
                    <Button color='ut-black' size='small' variant='minimal' icon={BookmarkSimple}>
                        Bookmarks
                    </Button>
                    <Button color='ut-black' size='small' variant='minimal' icon={MapPinArea}>
                        UT Map
                    </Button>
                </div>
            </div>
        </div>
    );
}
