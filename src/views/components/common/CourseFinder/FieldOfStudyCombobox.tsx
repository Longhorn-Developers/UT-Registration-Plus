import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react';
import type { FieldOfStudy } from '@shared/types/FieldOfStudy';
import Text from '@views/components/common/Text/Text';
import { parseCourseCode, searchFieldsOfStudy } from '@views/lib/courseFinder';
import clsx from 'clsx';
import type { JSX, Ref } from 'react';
import { useMemo } from 'react';
import CaretDownIcon from '~icons/ph/caret-down';
import MagnifyingGlassIcon from '~icons/ph/magnifying-glass';

/**
 * Props for the FieldOfStudyCombobox component
 */
export interface FieldOfStudyComboboxProps {
    className?: string;
    fieldsOfStudy: readonly FieldOfStudy[];
    value: FieldOfStudy | null;
    /** The course number picked along with the field of study, when a course code like "C S 314" was picked */
    courseNumber: string | null;
    onChange: (fieldOfStudy: FieldOfStudy | null, courseNumber: string | null) => void;
    /** What's typed in the input to look for a field of study. Cleared once the list closes. */
    search: string;
    onSearchChange: (search: string) => void;
    inputRef?: Ref<HTMLInputElement>;
}

/**
 * A course code typed into the search, i.e. "cs 314", offered above the fields of study
 */
type CourseCodeOption = { fieldOfStudy: FieldOfStudy; courseNumber: string };

type Option = FieldOfStudy | CourseCodeOption;

const isCourseCode = (option: Option): option is CourseCodeOption => 'courseNumber' in option;

const optionKey = (option: Option | null) => {
    if (!option) return '';
    return isCourseCode(option) ? `${option.fieldOfStudy.code} ${option.courseNumber}` : option.code;
};

/**
 * A searchable dropdown for picking a field of study (department), matching by code or name. Typing a course code
 * like "cs 314" offers that course first, to search for it alone.
 * Follows the styling of the Input and Dropdown components.
 */
export default function FieldOfStudyCombobox({
    className,
    fieldsOfStudy,
    value,
    courseNumber,
    onChange,
    search,
    onSearchChange,
    inputRef,
}: FieldOfStudyComboboxProps): JSX.Element {
    const matches = useMemo(() => searchFieldsOfStudy(fieldsOfStudy, search), [fieldsOfStudy, search]);
    const courseCode = useMemo(() => parseCourseCode(fieldsOfStudy, search), [fieldsOfStudy, search]);
    const hasOptions = matches.length > 0 || courseCode !== null;

    const selected: Option | null = value && courseNumber ? { fieldOfStudy: value, courseNumber } : value;

    return (
        <Combobox<Option | null, false, 'div'>
            as='div'
            value={selected}
            onChange={(option: Option | null) => {
                if (!option) onChange(null, null);
                else if (isCourseCode(option)) onChange(option.fieldOfStudy, option.courseNumber);
                else onChange(option, null);
            }}
            onClose={() => onSearchChange('')}
            by={(a, b) => optionKey(a) === optionKey(b)}
            className={clsx('relative h-9', className)}
        >
            <MagnifyingGlassIcon className='pointer-events-none absolute left-spacing-3 top-1/2 h-5 w-5 -translate-y-1/2 text-ut-black/50' />
            <ComboboxInput
                ref={inputRef}
                aria-label='Field of study or course'
                placeholder='e.g. C S or C S 314'
                displayValue={(option: Option | null) => {
                    if (!option) return '';
                    return isCourseCode(option)
                        ? `${option.fieldOfStudy.code} ${option.courseNumber}`
                        : `${option.code} – ${option.name}`;
                }}
                onChange={e => onSearchChange(e.target.value)}
                className={clsx(
                    'h-full w-full pl-10 pr-9 bg-transparent text-[1rem] text-ut-black truncate',
                    'border border-ut-offwhite/50 border-rounded outline-none! focus:border-blue-500'
                )}
            />
            <ComboboxButton
                aria-label='Show fields of study'
                className='absolute inset-y-0 right-0 flex items-center bg-transparent px-spacing-3 text-ut-black'
            >
                <CaretDownIcon className='h-5 w-5' />
            </ComboboxButton>
            {/* Rendered in place, above the Dropdowns below it, rather than anchored: an anchored list is portalled into its own shadow root, which has taken focus away from the input */}
            <ComboboxOptions
                className={clsx(
                    'absolute left-0 top-full mt-spacing-1 flex flex-col p-spacing-1 w-full max-h-[240px] overflow-y-auto z-50',
                    'origin-top rounded bg-white text-black shadow-lg transition border border-ut-offwhite/50 focus:outline-none',
                    'data-[closed]:(opacity-0 scale-95)',
                    'data-[enter]:(ease-out-expo duration-150)',
                    'data-[leave]:(ease-out duration-50)'
                )}
            >
                {/* Says so when nothing matches, rather than hiding the list, so it's clear what Escape closes.
                    Screen readers hear it from the status below, since a list of options can only hold options. */}
                {!hasOptions && (
                    <Text aria-hidden variant='small' className='p-spacing-3 text-ut-black/80'>
                        No fields of study match "{search}"
                    </Text>
                )}
                {courseCode && (
                    <ComboboxOption
                        value={courseCode}
                        className={clsx(
                            'flex cursor-pointer select-none items-baseline gap-spacing-3 rounded p-spacing-3 text-ut-black/80',
                            'data-[focus]:bg-ut-offwhite/20 data-[selected]:text-ut-burntorange'
                        )}
                    >
                        <Text className='flex-shrink-0 font-bold!'>
                            {courseCode.fieldOfStudy.code} {courseCode.courseNumber}
                        </Text>
                        <Text variant='small' className='truncate'>
                            Search this course
                        </Text>
                    </ComboboxOption>
                )}
                {matches.map(field => (
                    <ComboboxOption
                        key={field.code}
                        value={field}
                        className={clsx(
                            'flex cursor-pointer select-none gap-spacing-3 rounded p-spacing-3 text-ut-black/80',
                            'data-[focus]:bg-ut-offwhite/20 data-[selected]:text-ut-burntorange'
                        )}
                    >
                        <Text className='w-11 flex-shrink-0 font-bold!'>{field.code}</Text>
                        <Text className='truncate'>{field.name}</Text>
                    </ComboboxOption>
                ))}
            </ComboboxOptions>
            {/* Without what was typed, so it isn't read out again with every keystroke */}
            <span role='status' className='sr-only'>
                {!hasOptions && 'No fields of study match'}
            </span>
        </Combobox>
    );
}
