import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import {
    BookmarkSimple,
    CalendarDots,
    Export,
    FilePng,
    FileText,
    MapPinArea,
    PlusCircle,
    SelectionPlus,
    Sidebar,
} from '@phosphor-icons/react';
import styles from '@views/components/calendar/CalendarHeader/CalendarHeader.module.scss';
import { saveAsCal, saveCalAsPng } from '@views/components/calendar/utils';
import { Button } from '@views/components/common/Button';
import DialogProvider from '@views/components/common/DialogProvider/DialogProvider';
import Divider from '@views/components/common/Divider';
import { ExtensionRootWrapper, styleResetClass } from '@views/components/common/ExtensionRoot/ExtensionRoot';
import ScheduleTotalHoursAndCourses from '@views/components/common/ScheduleTotalHoursAndCourses';
import Text from '@views/components/common/Text/Text';
import useSchedules from '@views/hooks/useSchedules';
import clsx from 'clsx';
import React from 'react';
/**
 * Opens the options page in a new tab.
 * @returns A promise that resolves when the options page is opened.
 */

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
        <div className='min-h-[91px] flex items-center gap-5 bg-red py-5 pl-6'>
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
            <Divider className='border-theme-offwhite1' size='1.75rem' orientation='vertical' />
            <div className={clsx(styles.cqInline, 'mr-5 flex flex-1 items-center gap-5 min-w-[380px]')}>
                <div className={clsx(styles.primaryActions, 'flex flex-shrink-0 items-center gap-5')} role='group'>
                    <Button variant='minimal' color='ut-black' icon={PlusCircle} className='flex-shrink-0'>
                        <Text variant='small'>Quick Add</Text>
                    </Button>
                    <Button variant='minimal' color='ut-black' icon={SelectionPlus} className='flex-shrink-0'>
                        <Text variant='small'>Add Block</Text>
                    </Button>
                    <DialogProvider>
                        <Menu>
                            <MenuButton className='h-fit bg-transparent p-0'>
                                <Button variant='minimal' color='ut-black' icon={Export} className='flex-shrink-0'>
                                    <Text variant='small'>Export</Text>
                                </Button>
                            </MenuButton>

                            <MenuItems
                                as={ExtensionRootWrapper}
                                className={clsx([
                                    styleResetClass,
                                    'w-42 cursor-pointer origin-top-right rounded bg-white p-1 text-black shadow-lg transition border border-ut-offwhite focus:outline-none',
                                    'data-[closed]:(opacity-0 scale-95)',
                                    'data-[enter]:(ease-out-expo duration-150)',
                                    'data-[leave]:(ease-out duration-50)',
                                    'mt-2',
                                ])}
                                transition
                                anchor='bottom start'
                            >
                                <MenuItem>
                                    <Text
                                        onClick={() => saveCalAsPng()}
                                        as='button'
                                        variant='small'
                                        className='w-full flex items-center gap-2 rounded bg-transparent p-2 text-left data-[focus]:bg-gray-200/40'
                                    >
                                        <FilePng className='h-4 w-4' />
                                        Save as .png
                                    </Text>
                                </MenuItem>
                                <MenuItem>
                                    <Text
                                        as='button'
                                        onClick={saveAsCal}
                                        variant='small'
                                        className='w-full flex items-center gap-2 rounded bg-transparent p-2 text-left data-[focus]:bg-gray-200/40'
                                    >
                                        <CalendarDots className='h-4 w-4' />
                                        Save as .cal
                                    </Text>
                                </MenuItem>
                                <MenuItem>
                                    <Text
                                        as='button'
                                        variant='small'
                                        className='w-full flex items-center gap-2 rounded bg-transparent p-2 text-left data-[focus]:bg-gray-200/40'
                                    >
                                        <FileText className='h-4 w-4' />
                                        Export Unique IDs
                                    </Text>
                                </MenuItem>
                            </MenuItems>
                        </Menu>
                    </DialogProvider>
                </div>
                <Divider className='border-theme-offwhite1' size='1.75rem' orientation='vertical' />
                <div
                    className={clsx(
                        styles.secondaryActions,
                        'min-w-fit flex flex-1 items-center justify-end gap-5 bg-red'
                    )}
                    role='group'
                >
                    <Button variant='minimal' color='ut-black' icon={BookmarkSimple}>
                        <Text variant='small'>Bookmarks</Text>
                    </Button>
                    <Button variant='minimal' color='ut-black' icon={MapPinArea}>
                        <Text variant='small'>UT Map</Text>
                    </Button>
                </div>
            </div>
        </div>
    );
}
