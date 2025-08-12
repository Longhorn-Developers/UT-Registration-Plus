import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { CalendarDots, Export, FileCode, FilePng, Sidebar } from '@phosphor-icons/react';
import styles from '@views/components/calendar/CalendarHeader/CalendarHeader.module.scss';
import { Button } from '@views/components/common/Button';
import DialogProvider from '@views/components/common/DialogProvider/DialogProvider';
import Divider from '@views/components/common/Divider';
import { ExtensionRootWrapper, styleResetClass } from '@views/components/common/ExtensionRoot/ExtensionRoot';
import { LargeLogo } from '@views/components/common/LogoIcon';
import ScheduleTotalHoursAndCourses from '@views/components/common/ScheduleTotalHoursAndCourses';
import useSchedules from '@views/hooks/useSchedules';
import clsx from 'clsx';
import React from 'react';

import { handleExportJson, saveAsCal, saveCalAsPng } from '../utils';

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
        <div
            style={{ scrollbarGutter: 'stable' }}
            className='sticky left-0 right-0 top-0 z-10 min-h-[85px] flex items-center gap-5 overflow-x-scroll overflow-y-hidden bg-white pl-spacing-7 pt-spacing-5'
        >
            {!sidebarOpen && (
                <Button
                    variant='minimal'
                    color='theme-black'
                    onClick={onSidebarToggle}
                    className='h-fit w-fit screenshot:hidden !p-0'
                    icon={Sidebar}
                />
            )}

            <LargeLogo className='hidden! screenshot:flex!' />
            <Divider className='self-center hidden! screenshot:block!' size='2.5rem' orientation='vertical' />

            <div className='min-w-[11.5rem] screenshot:transform-origin-left screenshot:scale-120'>
                <ScheduleTotalHoursAndCourses
                    scheduleName={activeSchedule.name}
                    totalHours={activeSchedule.hours}
                    totalCourses={activeSchedule.courses.length}
                />
            </div>
            <Divider className='self-center screenshot:hidden' size='1.75rem' orientation='vertical' />
            {/* min-w-[310px] is the value with all the buttons */}
            <div className={clsx(styles.cqInline, 'flex flex-1 gap-5 min-w-[45x] screenshot:hidden')}>
                <div className={clsx(styles.primaryActions, 'min-w-fit flex gap-5')}>
                    <DialogProvider>
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
                                {/* <MenuItem>
                                    <Button color='ut-black' size='small' variant='minimal' icon={FileTxt}>
                                        Export Unique IDs
                                    </Button>
                                </MenuItem> */}
                            </MenuItems>
                        </Menu>
                    </DialogProvider>
                    {/* <Button className='invisible' color='ut-black' size='small' variant='minimal' icon={PlusCircle}>
                        Quick Add
                    </Button>
                    <Button className='invisible' color='ut-black' size='small' variant='minimal' icon={SelectionPlus}>
                        Block
                    </Button> */}
                </div>
                {/* <Divider className='self-center' size='1.75rem' orientation='vertical' />
                <div className={clsx(styles.secondaryActions, 'min-w-fit flex flex-1 justify-end gap-5')}>
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
