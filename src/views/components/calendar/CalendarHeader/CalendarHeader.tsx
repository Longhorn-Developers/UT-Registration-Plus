import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ArrowsClockwise, CalendarDots, Export, FileCode, FilePng, FileText, Sidebar } from '@phosphor-icons/react';
import { OptionsStore } from '@shared/storage/OptionsStore';
import styles from '@views/components/calendar/CalendarHeader/CalendarHeader.module.scss';
import { Button } from '@views/components/common/Button';
import Divider from '@views/components/common/Divider';
import { ExtensionRootWrapper, styleResetClass } from '@views/components/common/ExtensionRoot/ExtensionRoot';
import { LargeLogo } from '@views/components/common/LogoIcon';
import QuickAddModal from '@views/components/common/QuickAddModal';
import ScheduleTotalHoursAndCourses from '@views/components/common/ScheduleTotalHoursAndCourses';
import Text from '@views/components/common/Text/Text';
import useRelativeTime from '@views/hooks/useRelativeTime';
import useSchedules from '@views/hooks/useSchedules';
import refreshCourses from '@views/lib/refreshCourses';
import clsx from 'clsx';
import { useCallback, useEffect, useRef, useState } from 'react';

import { handleExportJson, saveAsCal, saveAsText, saveCalAsPng } from '../utils';

export interface CalendarHeaderProps {
    sidebarOpen?: boolean;
    onSidebarToggle?: () => void;
}

/**
 * Renders the header component for the calendar.
 * @returns The JSX element representing the calendar header.
 */
export default function CalendarHeader({ sidebarOpen, onSidebarToggle }: CalendarHeaderProps): JSX.Element {
    const [activeSchedule] = useSchedules();
    const lastCheckedText = useRelativeTime(activeSchedule.lastCheckedAt);
    const [isRefreshing, setIsRefreshing] = useState(false);
    // track per-schedule cooldowns so switching schedules allows immediate refresh
    const [cooldownIds, setCooldownIds] = useState<Set<string>>(new Set());
    const [enableDataRefreshing, setEnableDataRefreshing] = useState(false);

    useEffect(() => {
        OptionsStore.get('enableDataRefreshing').then(setEnableDataRefreshing);
        const unsubscribe = OptionsStore.subscribe('enableDataRefreshing', ({ newValue }) => {
            setEnableDataRefreshing(newValue);
        });
        return () => OptionsStore.unsubscribe(unsubscribe);
    }, []);

    const isCooldown = cooldownIds.has(activeSchedule.id);
    const hasRightHandSide = enableDataRefreshing;
    const isRefreshingRef = useRef(false);
    isRefreshingRef.current = isRefreshing;

    const handleRefresh = useCallback(async () => {
        setIsRefreshing(true);
        // Ensure the spinner is visible long enough to provide visual feedback
        const minSpin = new Promise(r => setTimeout(r, 400));
        try {
            await chrome.storage.session.set({ pendingRefresh: true });
            const [success] = await Promise.all([refreshCourses(), minSpin]);
            if (success) {
                await chrome.storage.session.remove('pendingRefresh');
            }
        } catch (error) {
            console.error('Failed to refresh courses:', error);
            await chrome.storage.session.remove('pendingRefresh');
        } finally {
            setIsRefreshing(false);
            const scheduleId = activeSchedule.id;
            setCooldownIds(prev => new Set(prev).add(scheduleId));
            setTimeout(() => {
                setCooldownIds(prev => {
                    const next = new Set(prev);
                    next.delete(scheduleId);
                    return next;
                });
            }, 3000);
        }
    }, [activeSchedule]);

    // Auto-retry refresh after login redirect
    useEffect(() => {
        const checkPendingRefresh = async () => {
            const { pendingRefresh } = await chrome.storage.session.get('pendingRefresh');
            if (pendingRefresh && !isRefreshingRef.current) {
                handleRefresh();
            }
        };

        checkPendingRefresh();

        const onVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                checkPendingRefresh();
            }
        };
        document.addEventListener('visibilitychange', onVisibilityChange);
        return () => document.removeEventListener('visibilitychange', onVisibilityChange);
    }, [handleRefresh]);

    return (
        <div
            style={{ scrollbarGutter: 'auto' }}
            className='sticky left-0 right-0 top-0 z-10 min-h-[75px] flex items-center gap-5 oveflow-x-auto overflow-y-hidden bg-white pl-spacing-7 pt-spacing-5 pb-1'
        >
            {!sidebarOpen && (
                <Button
                    variant='minimal'
                    size='small'
                    color='theme-black'
                    onClick={onSidebarToggle}
                    className='screenshot:hidden'
                    icon={Sidebar}
                />
            )}

            <LargeLogo className='hidden! screenshot:flex!' />
            <Divider className='self-center hidden! screenshot:block!' size='2.5rem' orientation='vertical' />

            <div className='truncate overflow-hidden flex-initial min-w-[min-content] screenshot:transform-origin-left screenshot:scale-120'>
                <ScheduleTotalHoursAndCourses
                    scheduleId={activeSchedule.id}
                    scheduleName={activeSchedule.name}
                    totalHours={activeSchedule.hours}
                    totalCourses={activeSchedule.courses.length}
                />
                {/*<div className="inline truncate min-w-0 inline-block flex-1">Hello world please truncate me</div>*/}
            </div>
            <Divider className='self-center screenshot:hidden' size='1.75rem' orientation='vertical' />
            <div className={clsx(styles.cqInline, 'flex grow shrink-0 gap-5 overflow-hidden screenshot:hidden')}>
                <div className={clsx(styles.primaryActions, 'flex min-w-max gap-5')}>
                    <QuickAddModal />
                    <Menu>
                        <MenuButton className='bg-transparent'>
                            <Button color='ut-black' size='small' variant='minimal' icon={Export}>
                                Export
                            </Button>
                        </MenuButton>
                        <MenuItems
                            as={ExtensionRootWrapper}
                            className={clsx([
                                styleResetClass,
                                'mt-spacing-3',
                                'min-w-max cursor-pointer origin-top-right rounded bg-white p-1 text-black shadow-lg transition border border-ut-offwhite/50 focus:outline-none z-20',
                                'data-[closed]:(opacity-0 scale-95)',
                                'data-[enter]:(ease-out-expo duration-150)',
                                'data-[leave]:(ease-out duration-50)',
                            ])}
                            transition
                            anchor='bottom start'
                        >
                            <MenuItem>
                                <Button
                                    className='w-full flex justify-start'
                                    onClick={() => requestAnimationFrame(() => saveCalAsPng())}
                                    color='ut-black'
                                    size='small'
                                    variant='minimal'
                                    icon={FilePng}
                                >
                                    Save as .png
                                </Button>
                            </MenuItem>
                            <MenuItem>
                                <Button
                                    className='w-full flex justify-start'
                                    onClick={saveAsCal}
                                    color='ut-black'
                                    size='small'
                                    variant='minimal'
                                    icon={CalendarDots}
                                >
                                    Save as .cal
                                </Button>
                            </MenuItem>
                            <MenuItem>
                                <Button
                                    className='w-full flex justify-start'
                                    onClick={() => handleExportJson(activeSchedule.id)}
                                    color='ut-black'
                                    size='small'
                                    variant='minimal'
                                    icon={FileCode}
                                >
                                    Save as .json
                                </Button>
                            </MenuItem>
                            <MenuItem>
                                <Button
                                    className='w-full flex justify-start'
                                    onClick={saveAsText}
                                    color='ut-black'
                                    size='small'
                                    variant='minimal'
                                    icon={FileText}
                                >
                                    Save as .txt
                                </Button>
                            </MenuItem>
                            {/* <MenuItem>
                                <Button color='ut-black' size='small' variant='minimal' icon={FileTxt}>
                                    Export Unique IDs
                                </Button>
                            </MenuItem> */}
                        </MenuItems>
                    </Menu>
                    {/* <Button className='invisible' color='ut-black' size='small' variant='minimal' icon={SelectionPlus}>
                        Block
                    </Button> */}
                </div>
                {hasRightHandSide && <Divider className='self-center' size='1.75rem' orientation='vertical' />}
                <div className={clsx(styles.secondaryActions, 'flex items-center gap-3 ml-auto')}>
                    {enableDataRefreshing && lastCheckedText && (
                        <Text variant='mini' className='whitespace-nowrap text-theme-black/50 !font-normal'>
                            Last checked: {lastCheckedText}
                        </Text>
                    )}
                    {enableDataRefreshing && (
                        <Button
                            color='ut-black'
                            size='small'
                            variant='minimal'
                            icon={ArrowsClockwise}
                            iconProps={{
                                className: clsx({
                                    'animate-spin animate-duration-800': isRefreshing,
                                }),
                            }}
                            onClick={handleRefresh}
                            disabled={isRefreshing || isCooldown}
                        >
                            Refresh
                        </Button>
                    )}
                </div>
                {/* <div className={clsx(styles.secondaryActions, 'min-w-fit flex flex-1 justify-end gap-5')}>
                    <Button className='invisible' color='ut-black' size='small' variant='minimal' icon={BookmarkSimple}>
                        Bookmarks
                    </Button>
                    <Button className='invisible' color='ut-black' size='small' variant='minimal' icon={MapPinArea}>
                        UT Map
                    </Button>
                </div> */}
            </div>
        </div>
    );
}
