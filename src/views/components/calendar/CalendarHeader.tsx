import { BookmarkSimple, Export, MapPinArea, PlusCircle, SelectionPlus, Sidebar } from '@phosphor-icons/react';
import { Button } from '@views/components/common/Button';
import Divider from '@views/components/common/Divider';
import { LargeLogo } from '@views/components/common/LogoIcon';
import ScheduleTotalHoursAndCourses from '@views/components/common/ScheduleTotalHoursAndCourses';
import useSchedules from '@views/hooks/useSchedules';
import { useScreenSize } from '@views/hooks/useScreenSize';
import React from 'react';

import Text from '../common/Text/Text';

/**
 * Opens the options page in a new tab.
 * @returns A promise that resolves when the options page is opened.
 */
// const handleOpenOptions = async (): Promise<void> => {
//     const url = chrome.runtime.getURL('/options.html');
//     await openTabFromContentScript(url);
// };

interface CalendarHeaderProps {
    onSidebarToggle?: () => void;
    showSidebar: boolean;
}

const PRIMARY_ACTIONS_BREAKPOINT = 1113; // in px
const SECONDARY_ACTIONS_BREAKPOINT = 922; // in px

/**
 * Renders the header component for the calendar.
 * @returns The JSX element representing the calendar header.
 */
export default function CalendarHeader({ onSidebarToggle, showSidebar }: CalendarHeaderProps): JSX.Element {
    const [activeSchedule] = useSchedules();
    const { width } = useScreenSize();

    return (
        <div className='flex items-center gap-5 overflow-x-auto overflow-y-hidden border-b border-ut-offwhite py-5 pl-6 md:overflow-x-hidden'>
            <Button
                variant='single'
                icon={Sidebar}
                color='ut-gray'
                onClick={onSidebarToggle}
                className='flex-shrink-0 screenshot:hidden'
            />
            {showSidebar && (
                <>
                    <LargeLogo className='flex-shrink-0' />
                    <Divider className='mx-2 flex-shrink-0 self-center md:mx-4' size='2.5rem' orientation='vertical' />
                </>
            )}

            <div className='min-w-0'>
                <div className='screenshot:transform-origin-left screenshot:scale-120'>
                    <ScheduleTotalHoursAndCourses
                        scheduleName={activeSchedule.name}
                        totalHours={activeSchedule.hours}
                        totalCourses={activeSchedule.courses.length}
                    />
                </div>
            </div>
            <Divider size='2.5rem' orientation='vertical' />
            <div className='flex flex-shrink-0 items-center gap-5'>
                <Button variant='single' color='ut-black' icon={PlusCircle} className='flex-shrink-0'>
                    {width >= PRIMARY_ACTIONS_BREAKPOINT && <Text variant='small'>Quick Add</Text>}
                </Button>
                <Button variant='single' color='ut-black' icon={SelectionPlus} className='flex-shrink-0'>
                    {width >= PRIMARY_ACTIONS_BREAKPOINT && <Text variant='small'>Add Block</Text>}
                </Button>
                <Button variant='single' color='ut-black' icon={Export} className='flex-shrink-0'>
                    {width >= PRIMARY_ACTIONS_BREAKPOINT && <Text variant='small'>Export</Text>}
                </Button>
            </div>
            <Divider size='2.5rem' orientation='vertical' />
            <div className='mr-5 flex flex-1 items-center justify-end gap-5'>
                <Button variant='single' color='ut-black' icon={BookmarkSimple} className='flex-shrink-0'>
                    {width >= SECONDARY_ACTIONS_BREAKPOINT && <Text variant='small'>Bookmarks</Text>}
                </Button>
                <Button variant='single' color='ut-black' icon={MapPinArea} className='flex-shrink-0'>
                    {width >= SECONDARY_ACTIONS_BREAKPOINT && <Text variant='small'>UT Map</Text>}
                </Button>
            </div>
        </div>
    );
}
