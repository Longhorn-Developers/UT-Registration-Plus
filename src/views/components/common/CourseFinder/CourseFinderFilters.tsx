import type { InstructionMode } from '@shared/types/Course';
import { Button } from '@views/components/common/Button';
import { flagMap } from '@views/components/common/Chip';
import Collapse from '@views/components/common/CourseFinder/Collapse';
import Dropdown, { type DropdownOption } from '@views/components/common/Dropdown';
import Input from '@views/components/common/Input';
import type { UseCourseFinderReturn } from '@views/hooks/useCourseFinder';
import { DEFAULT_LEVELS, LEVEL_CHOICES, type UseCourseFinderFormReturn } from '@views/hooks/useCourseFinderForm';
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
import BookOpenTextIcon from '~icons/ph/book-open-text';
import CaretDownIcon from '~icons/ph/caret-down';
import ClockIcon from '~icons/ph/clock';
import FlagIcon from '~icons/ph/flag';
import FunnelIcon from '~icons/ph/funnel';
import GraduationCapIcon from '~icons/ph/graduation-cap';
import LaptopIcon from '~icons/ph/laptop';
import LockSimpleOpenIcon from '~icons/ph/lock-simple-open';
import ProhibitIcon from '~icons/ph/prohibit';
import TextAaIcon from '~icons/ph/text-aa';

import { CheckboxGroup, CheckboxOption, IconRow, SemesterSelect } from './FinderControls';

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

const LEVEL_OPTIONS = LEVEL_CHOICES.map(choice => ({
    value: choice.level,
    label: choice.label,
    description: choice.description,
}));

const HOURS_OPTIONS = CREDIT_HOURS_OPTIONS.map(hours => ({
    value: hours,
    label: hours === MAX_CREDIT_HOURS_OPTION ? `${hours}+` : String(hours),
    description:
        hours === MAX_CREDIT_HOURS_OPTION
            ? `${hours} or more credit hours`
            : `${hours} credit hour${hours === 1 ? '' : 's'}`,
}));

/**
 * Props for the CourseFinderFilters component
 */
export interface CourseFinderFiltersProps {
    finder: Pick<
        UseCourseFinderReturn,
        'filters' | 'setFilters' | 'availableFlags' | 'semester' | 'areSemestersLoading'
    >;
    form: Pick<UseCourseFinderFormReturn, 'department' | 'courseNumber' | 'levels' | 'setLevels'>;
    /** Whether the filters are shown, or only the button that shows them */
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
}

/**
 * The semester to search, and filters for narrowing down the Course Finder's results: the levels to search, credit
 * hours, core curriculum area, instruction mode, flags, keyword, time conflicts with the active schedule, and status.
 * The filters are hidden behind a button that shows how many are active, and laid out like the custom block form,
 * with an icon for each line. Searching without a field of study searches the core curriculum area picked here.
 */
export default function CourseFinderFilters({
    finder,
    form,
    isOpen,
    onOpenChange,
}: CourseFinderFiltersProps): JSX.Element {
    const { filters, setFilters, availableFlags, semester, areSemestersLoading } = finder;
    const toggleRef = useRef<HTMLButtonElement>(null);

    const update = (changes: Partial<Filters>) => setFilters(prev => ({ ...prev, ...changes }));
    const toggle = <T,>(list: readonly T[], item: T) =>
        list.includes(item) ? list.filter(i => i !== item) : [...list, item];

    // The levels only narrow down a field of study (a course is the same course at every level)
    const areLevelsUsed = form.department !== null && form.courseNumber === null;
    const areLevelsChanged =
        form.levels.length !== DEFAULT_LEVELS.length || form.levels.some(level => !DEFAULT_LEVELS.includes(level));

    const activeCount = [
        areLevelsUsed && areLevelsChanged,
        filters.keyword.trim() !== '',
        filters.coreCode !== null,
        filters.instructionMode !== null,
        filters.creditHours.length > 0,
        filters.flags.length > 0,
        filters.openOnly,
        filters.hideConflicts,
    ].filter(Boolean).length;

    const clear = () => {
        setFilters(DEFAULT_COURSE_FINDER_FILTERS);
        form.setLevels(DEFAULT_LEVELS);
        // Clear goes away with nothing left to clear, which would drop focus
        toggleRef.current?.focus();
    };

    return (
        <div className='flex flex-col'>
            {/* Quiet buttons, like the calendar header's, pulled out by their padding so their icons line up with the
                search field above */}
            <div className='-mx-spacing-3 flex flex-row items-center justify-between gap-spacing-3'>
                <SemesterSelect
                    selectedOption={semester.selectedOption}
                    options={semester.dropdownOptions}
                    onChange={semester.onOptionChange}
                    isLoading={areSemestersLoading}
                />
                <Button
                    ref={toggleRef}
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
            </div>
            {/* The space above the filters is inside what opens and closes, so it doesn't jump in or out at the end */}
            <Collapse show={isOpen} className='flex flex-col gap-spacing-5 pb-spacing-4 pt-spacing-4'>
                {areLevelsUsed && (
                    <IconRow icon={GraduationCapIcon} name='Levels' alignIcon='end'>
                        <CheckboxGroup
                            options={LEVEL_OPTIONS}
                            isChecked={level => form.levels.includes(level)}
                            onToggle={level => form.setLevels(toggle(form.levels, level))}
                            // There has to be a level to search
                            isDisabled={level => form.levels.length === 1 && form.levels.includes(level)}
                        />
                    </IconRow>
                )}
                <IconRow icon={ClockIcon} name='Credit hours' alignIcon='end'>
                    <CheckboxGroup
                        options={HOURS_OPTIONS}
                        isChecked={hours => filters.creditHours.includes(hours)}
                        onToggle={hours => update({ creditHours: toggle(filters.creditHours, hours) })}
                    />
                </IconRow>
                <IconRow icon={BookOpenTextIcon} name='Core curriculum'>
                    {/* Each Dropdown is its own z-30 layer, so the open one goes above the Dropdowns after it */}
                    <Dropdown
                        className='data-[open]:z-35'
                        selectedOption={CORE_OPTIONS.find(o => o.id === (filters.coreCode ?? ANY_ID)) ?? null}
                        options={CORE_OPTIONS}
                        onOptionChange={option =>
                            update({ coreCode: option.id === ANY_ID ? null : (option.id as CoreCode) })
                        }
                    />
                </IconRow>
                <IconRow icon={LaptopIcon} name='Instruction mode'>
                    <Dropdown
                        className='data-[open]:z-35'
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
                </IconRow>
                {availableFlags.length > 0 && (
                    <IconRow icon={FlagIcon} name='Flags' alignIcon='end'>
                        <CheckboxGroup
                            options={availableFlags.map(flag => ({
                                value: flag,
                                label: flagMap[flag as keyof typeof flagMap] ?? flag,
                                description: `${flag} flag`,
                            }))}
                            isChecked={flag => filters.flags.includes(flag)}
                            onToggle={flag => update({ flags: toggle(filters.flags, flag) })}
                        />
                    </IconRow>
                )}
                <IconRow icon={TextAaIcon} name='Keyword'>
                    <Input
                        value={filters.keyword}
                        onChange={e => update({ keyword: e.target.value })}
                        placeholder='Title, instructor, or unique #'
                        aria-label='Filter by title, instructor, or unique number'
                    />
                </IconRow>
                <IconRow icon={ProhibitIcon} name='Time conflicts'>
                    <CheckboxOption
                        checked={filters.hideConflicts}
                        onChange={hideConflicts => update({ hideConflicts })}
                    >
                        Hide time conflicts
                    </CheckboxOption>
                </IconRow>
                <IconRow icon={LockSimpleOpenIcon} name='Status'>
                    <CheckboxOption checked={filters.openOnly} onChange={openOnly => update({ openOnly })}>
                        Open sections only
                    </CheckboxOption>
                </IconRow>
                {activeCount > 0 && (
                    <div className='-mr-spacing-3 flex justify-end'>
                        <Button color='ut-burntorange' size='small' variant='minimal' onClick={clear}>
                            Clear filters
                        </Button>
                    </div>
                )}
            </Collapse>
        </div>
    );
}
