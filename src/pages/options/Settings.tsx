import { getCourseColors } from '@shared/util/colors';
import CalendarCourseCell from '@views/components/calendar/CalendarCourseCell';
import { Button } from '@views/components/common/Button';
import Divider from '@views/components/common/Divider';
import ExtensionRoot from '@views/components/common/ExtensionRoot/ExtensionRoot';
import { SmallLogo } from '@views/components/common/LogoIcon';
import PopupCourseBlock from '@views/components/common/PopupCourseBlock';
import SwitchButton from '@views/components/common/SwitchButton';
import React, { useCallback, useEffect, useState } from 'react';
import { ExampleCourse } from 'src/stories/components/ConflictsWithWarning.stories';

import DeleteForeverIcon from '~icons/material-symbols/delete-forever';
import RefreshIcon from '~icons/material-symbols/refresh';

import App from './DevMode';

interface TeamMember {
    name: string;
    role: string;
}

const useDevMode = (targetCount: number): [boolean, () => void] => {
    const [count, setCount] = useState(0);
    const [active, setActive] = useState(false);
    const [lastClick, setLastClick] = useState(0);

    const incrementCount = useCallback(() => {
        const now = Date.now();
        if (now - lastClick < 500) {
            setCount(prevCount => {
                const newCount = prevCount + 1;
                if (newCount === targetCount) {
                    setActive(true);
                }
                return newCount;
            });
        } else {
            setCount(1);
        }
        setLastClick(now);
    }, [lastClick, targetCount]);

    useEffect(() => {
        const timer = setTimeout(() => setCount(0), 3000);
        return () => clearTimeout(timer);
    }, [count]);

    return [active, incrementCount];
};

/**
 * Renders the settings page for the UTRP (UT Registration Plus) extension.
 * Allows customization options and displays credits for the development team.
 *
 * @returns The JSX element representing the settings page.
 */
export default function SettingsPage() {
    const [showCourseStatus, setShowCourseStatus] = useState(true);
    const [showTimeLocation, setShowTimeLocation] = useState(true);
    const [highlightConflicts, setHighlightConflicts] = useState(true);
    const [loadAllCourses, setLoadAllCourses] = useState(true);

    const [devMode, toggleDevMode] = useDevMode(10);

    const teamMembers = [
        { name: 'Sriram Hariharan', role: 'Founder' },
        { name: 'Elie Soloveichik', role: 'Senior Software Engineer' },
        { name: 'Diego Perez', role: 'Senior Software Engineer' },
        { name: 'Lukas Zenick', role: 'Senior Software Engineer' },
        { name: 'Isaiah Rodriguez', role: 'Chief Design Officer' },
        { name: 'Som Gupta', role: 'Lead Software Engineer' },
        { name: 'Abhinav Chadaga', role: 'Software Engineer' },
        { name: 'Samuel Gunter', role: 'Software Engineer' },
        { name: 'Casey Charleston', role: 'Software Engineer' },
        { name: 'Dhruv Arora', role: 'Software Engineer' },
        { name: 'Derek Chen', role: 'Software Engineer' },
        { name: 'Vinson Zheng', role: 'Software Engineer' },
        { name: 'Vivek Malle', role: 'Software Engineer' },
    ] as const satisfies TeamMember[];

    if (devMode) {
        return <App />;
    }

    return (
        <ExtensionRoot>
            <div className='bg-white p-6'>
                <header className='mb-6 flex items-center justify-between'>
                    <div className='flex items-center'>
                        <SmallLogo className='pr-4' />
                        <Divider size='2rem' orientation='vertical' />
                        <h1 className='pl-4 text-xl text-ut-burntorange font-bold'>UTRP SETTINGS & CREDITS PAGE</h1>
                    </div>
                    <img src='/path-to-LD-icon.png' alt='LD Icon' className='h-10 w-10' />
                </header>

                <div className='flex'>
                    <div className='mr-4 w-1/2'>
                        <section className='mb-8'>
                            <h2 className='mb-4 text-xl text-ut-black font-semibold'>CUSTOMIZATION OPTIONS</h2>
                            <div className='flex space-x-4'>
                                <div className='w-1/2 space-y-4'>
                                    <div className='flex items-center justify-between'>
                                        <div className='max-w-xs'>
                                            <h3 className='text-ut-burntorange font-semibold'>Show Course Status</h3>
                                            <p className='text-sm text-gray-600'>
                                                Shows an indicator for waitlisted, cancelled, and closed courses.
                                            </p>
                                        </div>
                                        <SwitchButton isChecked={showCourseStatus} onChange={setShowCourseStatus} />
                                    </div>
                                    <Divider size='auto' orientation='horizontal' />
                                    <div className='flex items-center justify-between'>
                                        <div className='max-w-xs'>
                                            <h3 className='text-ut-burntorange font-semibold'>
                                                Show Time & Location in Popup
                                            </h3>
                                            <p className='text-sm text-gray-600'>
                                                Shows the course&apos;s time and location in the extension&apos;s popup.
                                            </p>
                                        </div>
                                        <SwitchButton isChecked={showTimeLocation} onChange={setShowTimeLocation} />
                                    </div>
                                </div>
                                <div className='o w-1/2 inline-flex flex-col items-start justify-start rounded-xl bg-ut-gray/10'>
                                    <div className='m-2 inline-flex items-center self-stretch justify-end gap-2.5'>
                                        <div className='text-center text-sm text-ut-gray font-medium'>Preview</div>
                                    </div>
                                    <div className='flex flex-col self-stretch px-5 pb-5 space-y-2'>
                                        <CalendarCourseCell
                                            colors={getCourseColors('orange')}
                                            courseDeptAndInstr={ExampleCourse.department}
                                            className={ExampleCourse.number}
                                            status={ExampleCourse.status}
                                            timeAndLocation={ExampleCourse.schedule.meetings[0]!.getTimeString({
                                                separator: '-',
                                            })}
                                        />
                                        <PopupCourseBlock colors={getCourseColors('orange')} course={ExampleCourse} />
                                    </div>
                                </div>
                            </div>
                        </section>

                        <Divider size='auto' orientation='horizontal' />

                        <section className='my-8'>
                            <h2 className='mb-4 text-xl text-ut-black font-semibold'>ADVANCED SETTINGS</h2>
                            <div className='space-y-4'>
                                <div className='flex items-center justify-between'>
                                    <div className='max-w-xs'>
                                        <h3 className='text-ut-burntorange font-semibold'>Refresh Data</h3>
                                        <p className='text-sm text-gray-600'>
                                            Refreshes waitlist, course status, and other info with the latest data from
                                            UT&apos;s site.
                                        </p>
                                    </div>
                                    <Button
                                        variant='outline'
                                        color='ut-black'
                                        icon={RefreshIcon}
                                        onClick={() => console.log('Refresh clicked')}
                                    >
                                        Refresh
                                    </Button>
                                </div>

                                <Divider size='auto' orientation='horizontal' />

                                <div className='flex items-center justify-between'>
                                    <div className='max-w-xs'>
                                        <h3 className='text-ut-burntorange font-semibold'>Course Conflict Highlight</h3>
                                        <p className='text-sm text-gray-600'>
                                            Adds a red strikethrough to courses that have conflicting times.
                                        </p>
                                    </div>
                                    <SwitchButton isChecked={highlightConflicts} onChange={setHighlightConflicts} />
                                </div>

                                <Divider size='auto' orientation='horizontal' />

                                <div className='flex items-center justify-between'>
                                    <div className='max-w-xs'>
                                        <h3 className='text-ut-burntorange font-semibold'>
                                            Load All Courses in Course Schedule
                                        </h3>
                                        <p className='text-sm text-gray-600'>
                                            Loads all courses in the Course Schedule site by scrolling, instead of using
                                            next/prev page buttons.
                                        </p>
                                    </div>
                                    <SwitchButton isChecked={loadAllCourses} onChange={setLoadAllCourses} />
                                </div>

                                <Divider size='auto' orientation='horizontal' />

                                <div className='flex items-center justify-between'>
                                    <div className='max-w-xs'>
                                        <h3 className='text-ut-burntorange font-semibold'>Reset All Data</h3>
                                        <p className='text-sm text-gray-600'>
                                            Erases all schedules and courses you have.
                                        </p>
                                    </div>
                                    <Button
                                        variant='outline'
                                        color='ut-red'
                                        icon={DeleteForeverIcon}
                                        onClick={() => console.log('Erase clicked')}
                                    >
                                        Erase All
                                    </Button>
                                </div>
                            </div>
                        </section>

                        <Divider size='auto' orientation='horizontal' />

                        <section className='my-8'>
                            <h2 className='mb-4 text-xl text-ut-black font-semibold' onClick={toggleDevMode}>
                                Dev Mode
                            </h2>
                        </section>
                    </div>

                    <section className='ml-4 w-1/2'>
                        <section>
                            <h2 className='mb-4 text-xl text-ut-black font-semibold'>MEET THE TEAM BEHIND UTRP V2</h2>
                            <div className='grid grid-cols-2 gap-4 md:grid-cols-4 sm:grid-cols-3'>
                                {teamMembers.map(member => (
                                    <div key={member.name} className='text-center'>
                                        <h3 className='text-ut-burntorange font-semibold'>{member.name}</h3>
                                        <p className='text-sm text-gray-600'>{member.role}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </section>
                </div>
            </div>
        </ExtensionRoot>
    );
}
