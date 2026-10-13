import type { InstructionMode } from '@shared/types/Course';
import { Button } from '@views/components/common/Button';
import { flagMap } from '@views/components/common/Chip';
import Dropdown, { type DropdownOption } from '@views/components/common/Dropdown';
import Input from '@views/components/common/Input';
import SwitchButton from '@views/components/common/SwitchButton';
import Text from '@views/components/common/Text/Text';
import type { UseCourseFinderReturn } from '@views/hooks/useCourseFinder';
import {
    CORE_CURRICULUM,
    type CoreCode,
    CREDIT_HOURS_OPTIONS,
    DEFAULT_COURSE_FINDER_FILTERS,
    type CourseFinderFilters as Filters,
    MAX_CREDIT_HOURS_OPTION,
} from '@views/lib/courseFinder';
import clsx from 'clsx';
import type { JSX } from 'react';
import { useRef } from 'react';
import CaretDownIcon from '~icons/ph/caret-down';
import FunnelIcon from '~icons/ph/funnel';

const ANY_ID = 'any';

const CORE_OPTIONS: DropdownOption[] = [
    { id: ANY_ID, label: 'Any core' },
    ...CORE_CURRICULUM.map(core => ({ id: core.code, label: core.label })),
];

const INSTRUCTION_MODE_OPTIONS = [
    { id: ANY_ID, label: 'Any mode' },
    { id: 'In Person', label: 'In person' },
    { id: 'Online', label: 'Online' },
    { id: 'Hybrid', label: 'Hybrid' },
] as const satisfies DropdownOption[];

/**
 * Props for the CourseFinderFilters component
 */
export interface CourseFinderFiltersProps {
    finder: Pick<UseCourseFinderReturn, 'filters' | 'setFilters' | 'availableFlags'>;
    /** Whether the filters are shown, or only the button that shows them */
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
}

/**
 * Filters for narrowing down the Course Finder's results by keyword, core curriculum area, credit hours, flags,
 * instruction mode, status, and time conflicts with the active schedule. They're hidden behind a button that
 * shows how many are active. Searching without a field of study searches the core curriculum area picked here.
 */
export default function CourseFinderFilters({ finder, isOpen, onOpenChange }: CourseFinderFiltersProps): JSX.Element {
    const { filters, setFilters, availableFlags } = finder;
    const toggleRef = useRef<HTMLButtonElement>(null);

    const update = (changes: Partial<Filters>) => setFilters(prev => ({ ...prev, ...changes }));
    const toggle = <T,>(list: T[], item: T) => (list.includes(item) ? list.filter(i => i !== item) : [...list, item]);

    const activeCount = [
        filters.keyword.trim() !== '',
        filters.coreCode !== null,
        filters.instructionMode !== null,
        filters.creditHours.length > 0,
        filters.flags.length > 0,
        filters.openOnly,
        filters.hideConflicts,
    ].filter(Boolean).length;

    return (
        <div className='flex flex-col gap-spacing-3'>
            {/* Minimal buttons, like the calendar header's, pulled out by their padding so their icon and text line
                up with the fields above */}
            <div className='flex flex-row items-center justify-between gap-spacing-3'>
                <Button
                    ref={toggleRef}
                    className='-ml-spacing-3'
                    color='ut-black'
                    size='small'
                    variant='minimal'
                    icon={FunnelIcon}
                    onClick={() => onOpenChange(!isOpen)}
                    aria-expanded={isOpen}
                >
                    Filters{activeCount > 0 && ` (${activeCount})`}
                    <CaretDownIcon className={clsx('h-4 w-4 transition-transform', { 'rotate-180': isOpen })} />
                </Button>
                {activeCount > 0 && (
                    <Button
                        className='-mr-spacing-3'
                        color='ut-burntorange'
                        size='small'
                        variant='minimal'
                        onClick={() => {
                            setFilters(DEFAULT_COURSE_FINDER_FILTERS);
                            // Clear goes away with nothing left to clear, which would drop focus
                            toggleRef.current?.focus();
                        }}
                        aria-label='Clear filters'
                    >
                        Clear
                    </Button>
                )}
            </div>
            {isOpen && (
                <div className='flex flex-col gap-spacing-3'>
                    <Input
                        value={filters.keyword}
                        onChange={e => update({ keyword: e.target.value })}
                        placeholder='Title, instructor, or unique #'
                        aria-label='Filter by title, instructor, or unique number'
                    />
                    <Dropdown
                        selectedOption={CORE_OPTIONS.find(o => o.id === (filters.coreCode ?? ANY_ID)) ?? null}
                        options={CORE_OPTIONS}
                        onOptionChange={option =>
                            update({ coreCode: option.id === ANY_ID ? null : (option.id as CoreCode) })
                        }
                    />
                    <Dropdown
                        selectedOption={
                            INSTRUCTION_MODE_OPTIONS.find(o => o.id === (filters.instructionMode ?? ANY_ID)) ?? null
                        }
                        options={INSTRUCTION_MODE_OPTIONS}
                        onOptionChange={option =>
                            update({
                                instructionMode: option.id === ANY_ID ? null : (option.id as InstructionMode),
                            })
                        }
                    />
                    <fieldset className='m-0 flex flex-wrap items-center gap-spacing-2 border-none p-0'>
                        <Text as='legend' variant='small' className='float-left mr-spacing-2 text-ut-black'>
                            Hours
                        </Text>
                        {CREDIT_HOURS_OPTIONS.map(hours => {
                            const selected = filters.creditHours.includes(hours);
                            return (
                                <Button
                                    key={hours}
                                    aria-pressed={selected}
                                    color='ut-burntorange'
                                    size='mini'
                                    variant={selected ? 'filled' : 'outline'}
                                    className='min-w-8'
                                    onClick={() => update({ creditHours: toggle(filters.creditHours, hours) })}
                                >
                                    {hours === MAX_CREDIT_HOURS_OPTION ? `${hours}+` : hours}
                                </Button>
                            );
                        })}
                    </fieldset>
                    {availableFlags.length > 0 && (
                        <fieldset className='m-0 flex flex-wrap items-center gap-spacing-2 border-none p-0'>
                            <Text as='legend' variant='small' className='float-left mr-spacing-2 text-ut-black'>
                                Flags
                            </Text>
                            {availableFlags.map(flag => {
                                const selected = filters.flags.includes(flag);
                                return (
                                    <Button
                                        key={flag}
                                        aria-pressed={selected}
                                        title={`${flag} flag`}
                                        color='ut-burntorange'
                                        size='mini'
                                        variant={selected ? 'filled' : 'outline'}
                                        className='min-w-8'
                                        onClick={() => update({ flags: toggle(filters.flags, flag) })}
                                    >
                                        {flagMap[flag as keyof typeof flagMap] ?? flag}
                                    </Button>
                                );
                            })}
                        </fieldset>
                    )}
                    {/* Switches, like the settings' on/off options. Each is wrapped in a plain label, which names it and
                        flips it when its text is clicked: Headless UI's Label can't find its switch in a shadow root. */}
                    {/** biome-ignore lint/a11y/noLabelWithoutControl: the switch inside is a button, which a label can hold */}
                    <label className='flex cursor-pointer items-center justify-between gap-spacing-3'>
                        <Text variant='small' className='text-ut-black'>
                            Open sections only
                        </Text>
                        <SwitchButton isChecked={filters.openOnly} onChange={openOnly => update({ openOnly })} />
                    </label>
                    {/** biome-ignore lint/a11y/noLabelWithoutControl: the switch inside is a button, which a label can hold */}
                    <label className='flex cursor-pointer items-center justify-between gap-spacing-3'>
                        <Text variant='small' className='text-ut-black'>
                            Hide time conflicts
                        </Text>
                        <SwitchButton
                            isChecked={filters.hideConflicts}
                            onChange={hideConflicts => update({ hideConflicts })}
                        />
                    </label>
                </div>
            )}
        </div>
    );
}
