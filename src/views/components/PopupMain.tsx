import logoImage from '@assets/logo.png'; // Adjust the path as necessary
import { Status } from '@shared/types/Course';
import { StatusIcon } from '@shared/util/icons';
import Divider from '@views/components/common/Divider/Divider';
import ExtensionRoot from '@views/components/common/ExtensionRoot/ExtensionRoot';
import List from '@views/components/common/List/List'; // Ensure this path is correctly pointing to your List component
import PopupCourseBlock from '@views/components/common/PopupCourseBlock/PopupCourseBlock';
import Text from '@views/components/common/Text/Text';
import { handleOpenCalendar } from '@views/components/injected/CourseCatalogInjectedPopup/HeadingAndActions';
import useSchedules from '@views/hooks/useSchedules';
import { openTabFromContentScript } from '@views/lib/openNewTabFromContentScript';
import React from 'react';
import { tailwindColorways } from 'src/shared/util/storybook';

import CalendarIcon from '~icons/material-symbols/calendar-month';
import RefreshIcon from '~icons/material-symbols/refresh';
import SettingsIcon from '~icons/material-symbols/settings';

/**
 * Renders the main popup component.
 * This component displays the main schedule, courses, and options buttons.
 */
export default function PopupMain() {
    const [activeSchedule] = useSchedules();

    const draggableElements = activeSchedule?.courses.map((course, i) => (
        <PopupCourseBlock key={course.uniqueId} course={course} colors={tailwindColorways[i]} />
    ));

    const handleOpenOptions = async () => {
        //  Not sure if it's bad practice to export this
        const url = chrome.runtime.getURL('/src/pages/options/index.html');
        await openTabFromContentScript(url);
    };

    return (
        <ExtensionRoot>
            <div className='mx-auto max-w-sm rounded bg-white p-4 shadow-md'>
                <div className='mb-2 flex items-center justify-between bg-white'>
                    <div className='flex items-center'>
                        <img src={logoImage} alt='Logo' className='mr-2 h-10 w-10.4' />
                        <div>
                            <Text as='div' variant='h1-course' className='color-ut-burntorange'>
                                UT Registration
                            </Text>
                            <Text as='div' variant='h1-course' className='color-ut-orange'>
                                Plus
                            </Text>
                        </div>
                    </div>
                    <div className='flex items-center'>
                        <button className='rounded-lg bg-ut-burntorange p2' onClick={handleOpenCalendar}>
                            <CalendarIcon className='text-white' />
                        </button>
                        <button className='bg-transparent btn' onClick={handleOpenOptions}>
                            <SettingsIcon className='h-5 w-5 color-ut-black' />
                        </button>
                    </div>
                </div>
                <Divider orientation='horizontal' className='my-4' size='100%' />
                <div className='mb-4 border border-ut-offwhite rounded p-2 text-left'>
                    <Text as='div' variant='h1-course' className='color-ut-burntorange'>
                        MAIN SCHEDULE:
                    </Text>
                    <div className='flex items-center justify-start gap2.5 color-ut-black'>
                        <Text variant='h1'>22 HOURS</Text>
                        <Text variant='h2-course'>8 Courses</Text>
                    </div>
                </div>
                {/* Integrate the List component here */}
                {activeSchedule ? (
                    <List
                        draggableElements={draggableElements}
                        itemHeight={100} // Adjust based on your content size
                        listHeight={500} // Adjust based on total height you want for the list
                        listWidth={350} // Adjust based on your layout/design
                        gap={12} // Spacing between items
                    />
                ) : null}
                <div className='mt-4 flex gap-2 border-t border-gray-200 p-4 text-xs'>
                    <div className='flex items-center gap-1'>
                        <div className='rounded bg-ut-black p-1px'>
                            <StatusIcon status={Status.WAITLISTED} className='h-5 w-5 text-white' />
                        </div>
                        <Text as='span' variant='mini'>
                            WAITLISTED
                        </Text>
                    </div>
                    <div className='flex items-center gap-1'>
                        <div className='rounded bg-ut-black p-1px'>
                            <StatusIcon status={Status.CLOSED} className='h-5 w-5 text-white' />
                        </div>
                        <Text as='span' variant='mini'>
                            CLOSED
                        </Text>
                    </div>
                    <div className='flex items-center gap-1'>
                        <div className='rounded bg-ut-black p-1px'>
                            <StatusIcon status={Status.CANCELLED} className='h-5 w-5 text-white' />
                        </div>
                        <Text as='span' variant='mini'>
                            CANCELLED
                        </Text>
                    </div>
                </div>
                <div className='mt-2 text-center text-xs'>
                    <div className='inline-flex items-center justify-center text-ut-gray'>
                        <Text variant='mini'>DATA UPDATED ON: 12:00 AM 02/01/2024</Text>
                        <RefreshIcon className='ml-2 h-4 w-4 color-gray-600' />
                    </div>
                </div>
            </div>
        </ExtensionRoot>
    );
}
