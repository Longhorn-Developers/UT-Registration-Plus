import { Popover, PopoverButton, PopoverGroup, PopoverPanel } from '@headlessui/react';
import { addCourseByURL } from '@pages/background/lib/addCourseByURL';
import { background } from '@shared/messages';
import type { Semester } from '@shared/types/Course';
import { HashStraight, Plus, PlusCircle } from '@phosphor-icons/react';
import { TERM_TO_ID_MAP } from '@shared/util/generateSemesters';
import { useNumericInput } from '@views/hooks/useNumericInput';
import useSchedules from '@views/hooks/useSchedules';
import clsx from 'clsx';
import React, { useMemo } from 'react';

import { Button } from './Button';
import DialogProvider from './DialogProvider/DialogProvider';
import { ExtensionRootWrapper } from './ExtensionRoot/ExtensionRoot';
import Input from './Input';

const UNIQUE_ID_LENGTH = 5;

/**
 * Finds the current semester code based on today's date
 */
function getCurrentSemesterCode(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // 0-indexed
    let season: Semester['season'];
    if (month <= 4) season = 'Spring';
    else if (month <= 7) season = 'Summer';
    else season = 'Fall';
    return `${year}${TERM_TO_ID_MAP[season]}`;
}

/**
 * QuickAddModal component
 *
 * This component renders a modal that allows users to quickly add courses to their
 * current semester's schedule by entering a unique number.
 */
export default function QuickAddModal(): JSX.Element {
    const [activeSchedule] = useSchedules();
    const uniqueNumber = useNumericInput('', UNIQUE_ID_LENGTH);
    const semesterCode = useMemo(() => getCurrentSemesterCode(), []);

    const handleAddCourse = async () => {
        if (uniqueNumber.value.length !== UNIQUE_ID_LENGTH) return;

        const loggedInToUT = await background.validateLoginStatus({
            url: 'https://utdirect.utexas.edu/apps/registrar/course_schedule/utrp_login/',
        });

        if (!loggedInToUT) return;

        const courseUrl = `https://utdirect.utexas.edu/apps/registrar/course_schedule/${semesterCode}/${uniqueNumber.value}/`;
        await addCourseByURL(activeSchedule, courseUrl);
        uniqueNumber.reset();
    };

    return (
        <DialogProvider>
            <Popover>
                <PopoverButton className='bg-transparent' as='div'>
                    <Button color='ut-black' size='small' variant='minimal' icon={PlusCircle}>
                        Quick Add
                    </Button>
                </PopoverButton>
                <PopoverPanel
                    as={ExtensionRootWrapper}
                    className={clsx([
                        'mt-spacing-3',
                        'origin-top rounded bg-white text-black shadow-lg transition border border-ut-offwhite/50 focus:outline-none',
                        'data-[closed]:(opacity-0 scale-95)',
                        'data-[enter]:(ease-out-expo duration-150)',
                        'data-[leave]:(ease-out duration-50)',
                        'flex flex-col gap-spacing-7 px-spacing-7 py-spacing-6 w-[400px] z-20',
                    ])}
                    transition
                    anchor='bottom start'
                >
                    <Input
                        value={uniqueNumber.value}
                        onChange={uniqueNumber.handleChange}
                        maxLength={UNIQUE_ID_LENGTH}
                        placeholder='Enter Unique Number...'
                        icon={HashStraight}
                    />
                    <PopoverGroup className='w-full flex flex-row justify-end gap-spacing-5'>
                        <PopoverPanel>
                            {({ close }) => (
                                <Button
                                    color='ut-black'
                                    size='regular'
                                    variant='minimal'
                                    onClick={() => {
                                        uniqueNumber.reset();
                                        close();
                                    }}
                                >
                                    Cancel
                                </Button>
                            )}
                        </PopoverPanel>
                        <Button
                            color='ut-green'
                            size='regular'
                            variant='filled'
                            icon={Plus}
                            onClick={handleAddCourse}
                            disabled={uniqueNumber.value.length !== UNIQUE_ID_LENGTH}
                        >
                            Add Course
                        </Button>
                    </PopoverGroup>
                </PopoverPanel>
            </Popover>
        </DialogProvider>
    );
}
