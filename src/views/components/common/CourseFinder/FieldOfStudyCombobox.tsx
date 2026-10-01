import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react';
import type { FieldOfStudy } from '@shared/types/FieldOfStudy';
import Text from '@views/components/common/Text/Text';
import { searchFieldsOfStudy } from '@views/lib/courseFinder';
import clsx from 'clsx';
import type { JSX } from 'react';
import { useMemo, useState } from 'react';
import CaretDownIcon from '~icons/ph/caret-down';

/**
 * Props for the FieldOfStudyCombobox component
 */
export interface FieldOfStudyComboboxProps {
    className?: string;
    fieldsOfStudy: readonly FieldOfStudy[];
    value: FieldOfStudy | null;
    onChange: (fieldOfStudy: FieldOfStudy | null) => void;
}

/**
 * A searchable dropdown for picking a field of study (department), matching by code or name.
 * Follows the styling of the Input and Dropdown components.
 */
export default function FieldOfStudyCombobox({
    className,
    fieldsOfStudy,
    value,
    onChange,
}: FieldOfStudyComboboxProps): JSX.Element {
    const [search, setSearch] = useState('');
    const matches = useMemo(() => searchFieldsOfStudy(fieldsOfStudy, search), [fieldsOfStudy, search]);

    return (
        <Combobox
            as='div'
            value={value}
            onChange={onChange}
            onClose={() => setSearch('')}
            by='code'
            className={clsx('relative h-9', className)}
        >
            <ComboboxInput
                aria-label='Field of study'
                placeholder='Field of study, e.g. C S'
                displayValue={(field: FieldOfStudy | null) => (field ? `${field.code} – ${field.name}` : '')}
                onChange={e => setSearch(e.target.value)}
                className={clsx(
                    'h-full w-full pl-spacing-4 pr-9 bg-transparent text-[1rem] text-ut-black truncate',
                    'border border-ut-offwhite/50 border-rounded outline-none! focus:border-blue-500'
                )}
            />
            <ComboboxButton
                aria-label='Show fields of study'
                className='absolute inset-y-0 right-0 flex items-center bg-transparent px-spacing-3 text-ut-black'
            >
                <CaretDownIcon className='h-5 w-5' />
            </ComboboxButton>
            {/* Rendered in place rather than anchored (an anchored list is portalled out of the Dialog, which takes focus away from the input), and above the Dropdowns around it */}
            <ComboboxOptions
                className={clsx(
                    'absolute left-0 top-full mt-spacing-1 flex flex-col p-spacing-1 w-full min-w-80 max-h-[240px] overflow-y-auto z-50',
                    'origin-top rounded bg-white text-black shadow-lg transition border border-ut-offwhite/50 focus:outline-none',
                    'data-[closed]:(opacity-0 scale-95)',
                    'data-[enter]:(ease-out-expo duration-150)',
                    'data-[leave]:(ease-out duration-50)',
                    'empty:invisible'
                )}
            >
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
        </Combobox>
    );
}
