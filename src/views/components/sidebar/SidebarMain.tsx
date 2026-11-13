import { background } from '@shared/messages';
import { UserScheduleStore } from '@shared/storage/UserScheduleStore';
import { Button } from '@views/components/common/Button';
import CourseStatus from '@views/components/common/CourseStatus';
import Divider from '@views/components/common/Divider';
import { SmallLogo } from '@views/components/common/LogoIcon';
import Text from '@views/components/common/Text/Text';
import type { JSX, ReactNode } from 'react';
import CalendarDotsFillIcon from '~icons/ph/calendar-dots-fill';
import GearSixIcon from '~icons/ph/gear-six';
import PlusIcon from '~icons/ph/plus';

/**
 * Props for the SidebarMain component
 *
 * @param children - Body slot, rendered below the schedule count
 */
interface SidebarMainProps {
    children?: ReactNode;
}

/**
 * Renders the sidebar injected on the registration page.
 * Mirrors the popup's header and footer.
 *
 * @returns The sidebar component
 */
export default function SidebarMain({ children }: SidebarMainProps): JSX.Element {
    const scheduleCount = UserScheduleStore.useStore(store => store.schedules.length);

    // Same actions as PopupMain, without window.close() since this runs in the registration tab
    const handleCalendarOpenOnClick = () => background.switchToCalendarTab({});
    const handleOpenOptions = () => background.openNewTab({ url: chrome.runtime.getURL('/options.html') });

    return (
        <div className='absolute inset-0 flex flex-col bg-surface-raised shadow-[5px_5px_8px_0_rgba(26,32,36,0.05)]'>
            <div className='flex items-center justify-between px-spacing-6 py-spacing-5'>
                <SmallLogo />
                <div className='flex items-center gap-1.5'>
                    <Button
                        variant='filled'
                        size='small'
                        color='ut-burntorange'
                        onClick={handleCalendarOpenOnClick}
                        icon={CalendarDotsFillIcon}
                    >
                        Calendar
                    </Button>
                    <Button
                        variant='minimal'
                        size='small'
                        color='ut-black'
                        title='Settings'
                        className='!text-content-muted'
                        onClick={handleOpenOptions}
                        icon={GearSixIcon}
                    />
                </div>
            </div>
            <Divider className='bg-divider/50' orientation='horizontal' size='100%' />
            <div
                style={{ scrollbarGutter: 'stable' }}
                className='flex flex-1 flex-col gap-spacing-4 overflow-y-auto px-spacing-6 py-spacing-5'
            >
                <div className='flex items-center justify-between'>
                    <Text variant='h3' className='text-content'>
                        {scheduleCount} {scheduleCount === 1 ? 'SCHEDULE' : 'SCHEDULES'}
                    </Text>
                    {/* TODO: Implement adding a schedule */}
                    <Button
                        variant='minimal'
                        size='small'
                        color='theme-black'
                        className='!p-0 btn'
                        title='Add schedule'
                        icon={PlusIcon}
                    />
                </div>
                {children}
            </div>
            <div className='flex justify-center gap-spacing-6 px-spacing-6 py-spacing-4'>
                <CourseStatus status='WAITLISTED' size='small' />
                <CourseStatus status='CANCELLED' size='small' />
                <CourseStatus status='CLOSED' size='small' />
            </div>
        </div>
    );
}
