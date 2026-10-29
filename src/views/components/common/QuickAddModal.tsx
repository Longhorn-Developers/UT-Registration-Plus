import { Popover, PopoverButton, PopoverGroup, PopoverPanel } from '@headlessui/react';
import { background } from '@shared/messages';
import { OptionsStore } from '@shared/storage/OptionsStore';
import { UNIQUE_ID_LENGTH } from '@shared/types/Course';
import { UTRP_LOGIN_URL } from '@shared/util/appUrls';
import Text from '@views/components/common/Text/Text';
import { type CourseResult, useQuickAdd } from '@views/hooks/useQuickAdd';
import clsx from 'clsx';
import type { JSX } from 'react';
import { useEffect, useState } from 'react';
import { useTheme } from 'src/views/contexts/ThemeContext';
import { getActiveSchedule } from 'src/views/hooks/useSchedules';
import PlusIcon from '~icons/ph/plus';
import PlusCircleIcon from '~icons/ph/plus-circle';
import { Button } from './Button';
import Dropdown from './Dropdown';
import { ExtensionRootWrapper } from './ExtensionRoot/ExtensionRoot';
import Input from './Input';

const STATUS_MESSAGES: Partial<Record<CourseResult['status'], string>> = {
    idle: 'Enter the unique number of the course you want.',
    loading: 'Looking up course...',
    not_found: 'No courses found with this unique number.',
    already_added: 'This course is already in your schedule.',
};

/**
 * QuickAddModal component
 *
 * Renders a popover that allows users to quickly add courses to their
 * current schedule by entering a unique number and selecting a semester.
 */
export default function QuickAddModal(): JSX.Element {
    const reducedMotion = OptionsStore.useStore(store => store.enableReducedMotion);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>();
    const { semester, uniqueNumber, courseResult } = useQuickAdd(isLoggedIn);
    const statusMessage = STATUS_MESSAGES[courseResult.status];

    const { theme } = useTheme();

    const handleQuickAdd = async () => {
        setIsLoggedIn(await background.validateLoginStatus());
    };

    // Re-check login status whenever a full unique number is entered
    useEffect(() => {
        if (uniqueNumber.value.length !== UNIQUE_ID_LENGTH) return;
        background.validateLoginStatus().then(setIsLoggedIn);
    }, [uniqueNumber.value]);

    // While logged out, re-check login status when the user returns to this tab (e.g. after logging in elsewhere)
    useEffect(() => {
        if (isLoggedIn !== false) return undefined;

        const onVisibilityChange = () => {
            if (document.visibilityState !== 'visible') return;
            background.validateLoginStatus().then(setIsLoggedIn);
        };

        document.addEventListener('visibilitychange', onVisibilityChange);
        return () => document.removeEventListener('visibilitychange', onVisibilityChange);
    }, [isLoggedIn]);

    const handleAddCourse = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (courseResult.status !== 'found') return;

        await background.addCourse({
            scheduleId: getActiveSchedule().id,
            course: courseResult.course,
        });
        uniqueNumber.reset();
    };

    return (
        <Popover>
            <PopoverButton
                as={Button}
                color='ut-black'
                size='small'
                variant='minimal'
                icon={PlusCircleIcon}
                onClick={handleQuickAdd}
                className='bg-transparent !text-content'
            >
                Quick Add
            </PopoverButton>
            <PopoverPanel
                as={ExtensionRootWrapper}
                data-theme={theme}
                className={clsx([
                    'mt-spacing-3',
                    'origin-top rounded bg-surface-raised text-content shadow-lg border border-divider focus:outline-none',
                    !reducedMotion && [
                        'transition',
                        'data-[closed]:(opacity-0 scale-95)',
                        'data-[enter]:(ease-out-expo duration-150)',
                        'data-[leave]:(ease-out duration-50)',
                    ],
                    'px-spacing-7 py-spacing-6 w-[400px] z-20',
                ])}
                transition={!reducedMotion}
                anchor='bottom start'
            >
                <form className='flex flex-col gap-spacing-7' onSubmit={handleAddCourse}>
                    <div className='flex flex-row gap-spacing-3'>
                        <Input
                            className='min-w-0 flex-1'
                            value={uniqueNumber.value}
                            onChange={uniqueNumber.handleChange}
                            maxLength={UNIQUE_ID_LENGTH}
                            placeholder='Enter unique number'
                            aria-label='Course unique number'
                            autoFocus
                        />
                        <Dropdown
                            className='w-40 flex-shrink-0'
                            selectedOption={semester.selectedOption}
                            placeholderText='Semester'
                            noOptionsText='No semesters found'
                            onOptionChange={semester.onOptionChange}
                            options={semester.dropdownOptions}
                        />
                    </div>
                    {isLoggedIn === false ? (
                        <Text
                            variant='small'
                            className='self-center whitespace-nowrap text-content/50 !font-normal'
                            aria-live='polite'
                            aria-atomic='true'
                        >
                            <a
                                href={UTRP_LOGIN_URL}
                                target='_blank'
                                rel='noreferrer'
                                className='text-ut-burntorange underline'
                            >
                                Log in
                            </a>
                            {' to add courses'}
                        </Text>
                    ) : (
                        statusMessage && (
                            <Text variant='small' className='text-content' aria-live='polite' aria-atomic='true'>
                                {statusMessage}
                            </Text>
                        )
                    )}
                    {isLoggedIn !== false && courseResult.status === 'found' && (
                        <div className='flex flex-col gap-0.5 border border-divider rounded px-spacing-5 py-spacing-3 shadow-md'>
                            <Text variant='h4' className='text-content font-bold!'>
                                {courseResult.course.department} {courseResult.course.number}
                                {' \u2013 '}
                                {courseResult.course.courseName}
                            </Text>
                            {courseResult.course.schedule.meetings.map((m, i) => (
                                // biome-ignore lint/suspicious/noArrayIndexKey: TODO:
                                <Text key={i} variant='small' className='text-content-muted'>
                                    {m.getDaysString({ format: 'short' })}{' '}
                                    {m.getTimeString({
                                        separator: '\u2013',
                                    })}
                                    {m.location ? `, ${m.location.building} ${m.location.room}` : ''}
                                </Text>
                            ))}
                        </div>
                    )}
                    <PopoverGroup className='w-full flex flex-row justify-end gap-spacing-5'>
                        <PopoverPanel>
                            {({ close }) => (
                                <Button
                                    color='ut-burntorange'
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
                            color={isLoggedIn !== false && courseResult.status === 'found' ? 'ut-green' : 'ut-gray'}
                            size='regular'
                            variant='filled'
                            icon={PlusIcon}
                            type='submit'
                            disabled={isLoggedIn === false || courseResult.status !== 'found'}
                        >
                            Add Course
                        </Button>
                    </PopoverGroup>
                </form>
            </PopoverPanel>
        </Popover>
    );
}
