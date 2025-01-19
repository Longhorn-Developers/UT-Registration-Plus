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
import { saveAsCal, saveCalAsPng } from '@views/components/calendar/utils';
import { Button } from '@views/components/common/Button';
import DialogProvider from '@views/components/common/DialogProvider/DialogProvider';
import Divider from '@views/components/common/Divider';
import { ExtensionRootWrapper, styleResetClass } from '@views/components/common/ExtensionRoot/ExtensionRoot';
import ScheduleTotalHoursAndCourses from '@views/components/common/ScheduleTotalHoursAndCourses';
import Text from '@views/components/common/Text/Text';
import useSchedules from '@views/hooks/useSchedules';
import clsx from 'clsx';
import React, { useEffect, useMemo, useRef, useState } from 'react';
/**
 * Opens the options page in a new tab.
 * @returns A promise that resolves when the options page is opened.
 */

interface CalendarHeaderProps {
    onSidebarToggle?: () => void;
}

const SECONDARY_ACTIONS_WITH_TEXT_WIDTH = 274; // in px
const PRIMARY_ACTION_WITH_TEXT_WIDTH = 405; // in px
const PRIMARY_ACTION_WITHOUT_TEXT_WIDTH = 160; // in px

/**
 * Renders the header component for the calendar.
 * @returns The JSX element representing the calendar header.
 */
export default function CalendarHeader({ onSidebarToggle }: CalendarHeaderProps): JSX.Element {
    const [activeSchedule] = useSchedules();
    const secondaryActionContainerRef = useRef<HTMLDivElement | null>(null);
    const [isDisplayingPrimaryActionsText, setIsDisplayingPrimaryActionsText] = useState(true);
    const [isDisplayingSecondaryActionsText, setIsDisplayingSecondaryActionsText] = useState(true);

    const resizeObserver = useMemo(
        () =>
            new ResizeObserver(([entry]) => {
                if (!entry) return;

                const width = Math.round(entry.contentRect.width);

                if (
                    // Collapses the primary action section
                    isDisplayingPrimaryActionsText &&
                    width < SECONDARY_ACTIONS_WITH_TEXT_WIDTH
                ) {
                    setIsDisplayingPrimaryActionsText(false);
                    return;
                }

                if (
                    // Expands the primary action section if there is enough room for it to expand
                    !isDisplayingPrimaryActionsText &&
                    width - SECONDARY_ACTIONS_WITH_TEXT_WIDTH >=
                        PRIMARY_ACTION_WITH_TEXT_WIDTH - PRIMARY_ACTION_WITHOUT_TEXT_WIDTH
                ) {
                    setIsDisplayingPrimaryActionsText(true);
                    return;
                }

                // Contracts the secondary action section
                if (isDisplayingSecondaryActionsText && width < SECONDARY_ACTIONS_WITH_TEXT_WIDTH) {
                    setIsDisplayingSecondaryActionsText(false);
                    return;
                }

                // Expands the secondary action section if there is enough room for it to expand
                if (!isDisplayingSecondaryActionsText && width >= SECONDARY_ACTIONS_WITH_TEXT_WIDTH) {
                    setIsDisplayingSecondaryActionsText(true);
                }
            }),
        [isDisplayingPrimaryActionsText, isDisplayingSecondaryActionsText]
    );

    useEffect(() => {
        if (!secondaryActionContainerRef.current) return;

        resizeObserver.observe(secondaryActionContainerRef.current);

        return () => resizeObserver.disconnect();
    }, [resizeObserver]);

    return (
        <div className='flex items-center gap-5 overflow-x-auto overflow-y-hidden py-5 pl-6 md:overflow-x-hidden'>
            <Button
                variant='minimal'
                icon={Sidebar}
                color='ut-black'
                onClick={onSidebarToggle}
                className='flex-shrink-0 screenshot:hidden'
            />
            <div className='min-w-[10.9375rem] screenshot:transform-origin-left screenshot:scale-120'>
                <ScheduleTotalHoursAndCourses
                    scheduleName={activeSchedule.name}
                    totalHours={activeSchedule.hours}
                    totalCourses={activeSchedule.courses.length}
                />
            </div>

            <Divider className='border-theme-offwhite1' size='1.75rem' orientation='vertical' />
            <div className='flex flex-shrink-0 items-center gap-5'>
                <Button variant='minimal' color='ut-black' icon={PlusCircle} className='flex-shrink-0'>
                    {isDisplayingPrimaryActionsText && <Text variant='small'>Quick Add</Text>}
                </Button>
                <Button variant='minimal' color='ut-black' icon={SelectionPlus} className='flex-shrink-0'>
                    {isDisplayingPrimaryActionsText && <Text variant='small'>Add Block</Text>}
                </Button>
                <DialogProvider>
                    <Menu>
                        <MenuButton className='h-fit bg-transparent p-0'>
                            <Button variant='minimal' color='ut-black' icon={Export} className='flex-shrink-0'>
                                {isDisplayingPrimaryActionsText && <Text variant='small'>Export</Text>}
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
            <div ref={secondaryActionContainerRef} className='mr-5 flex flex-1 items-center justify-end gap-5'>
                <Button variant='minimal' color='ut-black' icon={BookmarkSimple}>
                    {isDisplayingSecondaryActionsText && <Text variant='small'>Bookmarks</Text>}
                </Button>
                <Button variant='minimal' color='ut-black' icon={MapPinArea}>
                    {isDisplayingSecondaryActionsText && <Text variant='small'>UT Map</Text>}
                </Button>
            </div>
        </div>
    );
}
