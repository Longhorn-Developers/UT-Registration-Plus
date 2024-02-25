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
import { TestColors } from 'src/stories/components/PopupCourseBlock.stories';

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
        <PopupCourseBlock key={course.uniqueId} course={course} colors={TestColors[i]} />
    ));

    const handleOpenOptions = async () => {
        //  Not sure if it's bad practice to export this
        const url = chrome.runtime.getURL('/src/pages/options/index.html');
        await openTabFromContentScript(url);
    };

    return (
        <ExtensionRoot>
            <div className='mx-auto max-w-sm rounded-lg bg-white p-4 shadow-md'>
                <div className='mb-2 flex items-center justify-between bg-white'>
                    <div className='flex items-center'>
                        <img src={logoImage} alt='Logo' style={{ width: '40px', height: '40px', marginRight: '8px' }} />
                        <div>
                            <Text as='div' variant='h1-course' style={{ color: '#bf5700', fontSize: '1.3rem' }}>
                                UT Registration
                            </Text>
                            <Text as='div' variant='h1-course' style={{ color: '#f8971f', fontSize: '1.3rem' }}>
                                Plus
                            </Text>
                        </div>
                    </div>
                    <div className='flex items-center'>
                        <button
                            style={{ backgroundColor: '#bf5700', borderRadius: '8px', padding: '8px' }}
                            onClick={handleOpenCalendar}
                        >
                            <CalendarIcon color='white' />
                        </button>
                        <button
                            style={{
                                backgroundColor: 'white',
                                marginLeft: '10px',
                                borderRadius: '8px',
                                padding: '8px',
                                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                            }}
                            onClick={handleOpenOptions}
                        >
                            <SettingsIcon color='#C05621' />
                        </button>
                    </div>
                </div>
                <Divider color='#E2E8F0' type='solid' style={{ margin: '1rem 0' }} />
                <div
                    className='mb-4 rounded-lg bg-white p-2 text-left shadow-inner'
                    style={{ backgroundColor: 'white', border: '1px solid #FBD38D', borderRadius: '0.5rem' }}
                >
                    <Text as='div' variant='h2-course' style={{ color: '#DD6B20', fontSize: '1.2rem' }}>
                        MAIN SCHEDULE:
                    </Text>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'start', color: '#333f48' }}>
                        <Text
                            as='div'
                            variant='h1'
                            style={{ fontSize: '1.2rem', fontWeight: 'bold', marginRight: '0.5rem' }}
                        >
                            22 HOURS
                        </Text>
                        <Text as='div' variant='h2-course' style={{ fontSize: '1.2rem' }}>
                            8 Courses
                        </Text>
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
                <div className='mt-4 flex justify-between border-t border-gray-200 p-4 text-xs'>
                    <div className='flex items-center'>
                        <div
                            style={{
                                backgroundColor: '#6B7280',
                                padding: '1px',
                                borderRadius: '4px',
                                marginRight: '3px',
                                marginLeft: '8px',
                            }}
                        >
                            <StatusIcon status={Status.WAITLISTED} className='h-5 w-5 text-white' />
                        </div>
                        <Text as='span' variant='mini'>
                            WAITLISTED
                        </Text>
                    </div>
                    <div className='flex items-center'>
                        <div
                            style={{
                                backgroundColor: '#6B7280',
                                padding: '1px',
                                borderRadius: '4px',
                                marginRight: '3px',
                                marginLeft: '8px',
                            }}
                        >
                            <StatusIcon status={Status.CLOSED} className='h-5 w-5 text-white' />
                        </div>
                        <Text as='span' variant='mini'>
                            CLOSED
                        </Text>
                    </div>
                    <div className='flex items-center'>
                        <div
                            style={{
                                backgroundColor: '#6B7280',
                                padding: '1px',
                                borderRadius: '4px',
                                marginRight: '3px',
                                marginLeft: '8px',
                            }}
                        >
                            <StatusIcon status={Status.CANCELLED} className='h-5 w-5 text-white' />
                        </div>
                        <Text as='span' variant='mini'>
                            CANCELLED
                        </Text>
                    </div>
                </div>
                <div className='mt-2 text-center text-xs'>
                    <div className='inline-flex items-center justify-center'>
                        <Text as='div' variant='mini'>
                            DATA UPDATED ON: 12:00 AM 02/01/2024
                        </Text>
                        <RefreshIcon className='ml-2 h-4 w-4 text-gray-600' />
                    </div>
                </div>
            </div>
        </ExtensionRoot>
    );
}
