import { Popover, PopoverButton, PopoverGroup, PopoverPanel } from '@headlessui/react';
import { Plus, PlusCircle } from '@phosphor-icons/react';
import { background } from '@shared/messages';
import { UNIQUE_ID_LENGTH } from '@shared/types/Course';
import Text from '@views/components/common/Text/Text';
import { type CourseResult, useQuickAdd } from '@views/hooks/useQuickAdd';
import clsx from 'clsx';
import { getActiveSchedule } from 'src/views/hooks/useSchedules';

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
    const { semester, uniqueNumber, courseResult } = useQuickAdd();
    const statusMessage = STATUS_MESSAGES[courseResult.status];

    const handleQuickAdd = () => {
        background.validateLoginStatus();
    };

    const handleAddCourse = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (courseResult.status !== 'found') return;

        await background.addCourse({ scheduleId: getActiveSchedule().id, course: courseResult.course });
        uniqueNumber.reset();
    };

    return (
        <Popover>
            <PopoverButton className='bg-transparent' as='div'>
                <Button color='ut-black' size='small' variant='minimal' icon={PlusCircle} onClick={handleQuickAdd}>
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
                    'px-spacing-7 py-spacing-6 w-[400px] z-20',
                ])}
                transition
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
                    {statusMessage && (
                        <Text variant='small' className='text-ut-black'>
                            {statusMessage}
                        </Text>
                    )}
                    {courseResult.status === 'found' && (
                        <div className='flex flex-col gap-0.5 border border-ut-offwhite/50 rounded px-spacing-5 py-spacing-3 shadow-md'>
                            <Text variant='h4' className='text-black font-bold!'>
                                {courseResult.course.department} {courseResult.course.number}
                                {' \u2013 '}
                                {courseResult.course.courseName}
                            </Text>
                            {courseResult.course.schedule.meetings.map((m, i) => (
                                // biome-ignore lint/suspicious/noArrayIndexKey: TODO:
                                <Text key={i} variant='small' className='text-ut-black'>
                                    {m.getDaysString({ format: 'short' })} {m.getTimeString({ separator: '\u2013' })}
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
                            color={courseResult.status === 'found' ? 'ut-green' : 'ut-gray'}
                            size='regular'
                            variant='filled'
                            icon={Plus}
                            type='submit'
                            disabled={courseResult.status !== 'found'}
                        >
                            Add Course
                        </Button>
                    </PopoverGroup>
                </form>
            </PopoverPanel>
        </Popover>
    );
}
