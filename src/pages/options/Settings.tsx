import { Button } from '@views/components/common/Button';
import Divider from '@views/components/common/Divider';
import ExtensionRoot from '@views/components/common/ExtensionRoot/ExtensionRoot';
import { SmallLogo } from '@views/components/common/LogoIcon';
import SwitchButton from '@views/components/common/SwitchButton';
import React, { useCallback, useEffect, useState } from 'react';

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
                        <h1 className='pl-4 text-2xl text-ut-burntorange font-bold'>UTRP SETTINGS & CREDITS PAGE</h1>
                    </div>
                    <img src='/path-to-LD-icon.png' alt='LD Icon' className='h-10 w-10' />
                </header>

                <section className='mb-8'>
                    <h2 className='mb-4 text-xl text-ut-black font-semibold'>CUSTOMIZATION OPTIONS</h2>
                    <div className='space-y-4'>
                        <div className='flex items-center justify-between'>
                            <div>
                                <h3 className='text-ut-burntorange font-semibold'>Show Course Status</h3>
                                <p className='text-sm text-gray-600'>
                                    Shows an indicator for waitlisted, cancelled, and closed courses.
                                </p>
                            </div>
                            <SwitchButton isChecked={showCourseStatus} onChange={setShowCourseStatus} />
                        </div>
                        <Divider size='auto' orientation='horizontal' />
                        <div className='flex items-center justify-between'>
                            <div>
                                <h3 className='text-ut-burntorange font-semibold'>Show Time & Location in Popup</h3>
                                <p className='text-sm text-gray-600'>
                                    Shows the course&apos;s time and location in the extension&apos;s popup.
                                </p>
                            </div>
                            <SwitchButton isChecked={showTimeLocation} onChange={setShowTimeLocation} />
                        </div>
                    </div>
                </section>

                <Divider size='auto' orientation='horizontal' />

                <section className='mb-8'>
                    <h2 className='mb-4 text-xl text-ut-black font-semibold'>ADVANCED SETTINGS</h2>
                    <div className='space-y-4'>
                        <div className='flex items-center justify-between'>
                            <div>
                                <h3 className='text-ut-burntorange font-semibold'>Refresh Data</h3>
                                <p className='text-sm text-gray-600'>
                                    Refreshes waitlist, course status, and other info with the latest data from
                                    UT&apos;s site.
                                </p>
                            </div>
                            <Button variant='outline' color='ut-black' onClick={() => console.log('Refresh clicked')}>
                                Refresh
                            </Button>
                        </div>

                        <Divider size='auto' orientation='horizontal' />

                        <div className='flex items-center justify-between'>
                            <div>
                                <h3 className='text-ut-burntorange font-semibold'>Course Conflict Highlight</h3>
                                <p className='text-sm text-gray-600'>
                                    Adds a red strikethrough to courses that have conflicting times.
                                </p>
                            </div>
                            <SwitchButton isChecked={highlightConflicts} onChange={setHighlightConflicts} />
                        </div>

                        <Divider size='auto' orientation='horizontal' />

                        <div className='flex items-center justify-between'>
                            <div>
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
                            <div>
                                <h3 className='text-ut-burntorange font-semibold'>Reset All Data</h3>
                                <p className='text-sm text-gray-600'>Erases all schedules and courses you have.</p>
                            </div>
                            <Button variant='outline' color='ut-red' onClick={() => console.log('Erase clicked')}>
                                Erase All
                            </Button>
                        </div>
                    </div>
                </section>

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

                <section className='mb-8'>
                    <h2 className='mb-4 text-xl text-ut-black font-semibold' onClick={toggleDevMode}>
                        Dev Mode
                    </h2>
                </section>
            </div>
        </ExtensionRoot>
    );
}
