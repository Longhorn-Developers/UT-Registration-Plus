import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import type { DropdownOption } from '@views/components/common/Dropdown';
import Text from '@views/components/common/Text/Text';
import clsx from 'clsx';
import type { ComponentType, JSX, ReactNode, SVGProps } from 'react';
import CalendarBlankIcon from '~icons/ph/calendar-blank';
import CaretDownIcon from '~icons/ph/caret-down';

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

/**
 * A checkbox that looks like the custom block form's: an outlined square, filled in orange when checked. A real
 * checkbox underneath, kept out of sight, so a label around it names it and checks it.
 */
export function BoxCheckbox({
    checked,
    onChange,
    disabled = false,
}: {
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
}): JSX.Element {
    return (
        <span className='relative inline-flex flex-shrink-0'>
            <input
                type='checkbox'
                className='peer sr-only'
                checked={checked}
                disabled={disabled}
                onChange={e => onChange(e.target.checked)}
            />
            <span
                aria-hidden
                // Outlined darker as it or its label is hovered over, and faded while it can't be changed
                className='h-[35px] w-[35px] flex items-center justify-center border border-divider rounded btn-transition peer-disabled:opacity-50 peer-focus-visible:(outline-2 outline-blue-500 outline-offset-2 outline-solid) group-hover:border-content/30 dark:peer-focus-visible:outline-blue-400'
            >
                <span
                    className={clsx(
                        'h-[25.67px] w-[25.67px] rounded transition-colors',
                        checked && 'bg-ut-burntorange'
                    )}
                />
            </span>
        </span>
    );
}

/**
 * One line of a form laid out like the custom block form: an icon in a column of its own, then the controls. The icon
 * says what the line is for, with its name shown on hover and read out to screen readers.
 */
export function IconRow({
    icon: RowIcon,
    name,
    alignIcon = 'center',
    children,
}: {
    icon: Icon;
    name: string;
    /** Where the icon lines up with the controls: their middle, or the bottom of ones with labels above them */
    alignIcon?: 'center' | 'end';
    children: ReactNode;
}): JSX.Element {
    return (
        <fieldset
            className={clsx(
                'm-0 min-w-0 flex gap-spacing-5 border-none p-0',
                alignIcon === 'center' ? 'items-center' : 'items-end'
            )}
        >
            <legend className='sr-only'>{name}</legend>
            <span title={name} className={clsx('h-6 w-6 flex-shrink-0', alignIcon === 'end' && 'mb-[5.5px]')}>
                <RowIcon aria-hidden className='h-6 w-6' />
            </span>
            <div className='min-w-0 flex-1'>{children}</div>
        </fieldset>
    );
}

/**
 * A row of checkboxes with their names above them, like the custom block form's days
 */
export function CheckboxGroup<T extends string | number>({
    options,
    isChecked,
    onToggle,
    isDisabled,
}: {
    options: readonly { value: T; label: string; description?: string }[];
    isChecked: (value: T) => boolean;
    onToggle: (value: T) => void;
    isDisabled?: (value: T) => boolean;
}): JSX.Element {
    return (
        <div className='flex flex-wrap gap-x-spacing-3 gap-y-spacing-3'>
            {options.map(option => (
                // A plain label, which checks the box when its name is clicked
                // biome-ignore lint/a11y/noLabelWithoutControl: the checkbox is inside BoxCheckbox
                <label
                    key={option.value}
                    className='group flex cursor-pointer flex-col items-center gap-spacing-2 has-[:disabled]:cursor-not-allowed'
                    title={option.description}
                >
                    <Text variant='mini' className='uppercase'>
                        {option.label}
                    </Text>
                    <BoxCheckbox
                        checked={isChecked(option.value)}
                        onChange={() => onToggle(option.value)}
                        disabled={isDisabled?.(option.value)}
                    />
                </label>
            ))}
        </div>
    );
}

/**
 * A checkbox with its name beside it, like the custom block form's options
 */
export function CheckboxOption({
    checked,
    onChange,
    children,
}: {
    checked: boolean;
    onChange: (checked: boolean) => void;
    children: ReactNode;
}): JSX.Element {
    return (
        // biome-ignore lint/a11y/noLabelWithoutControl: the checkbox is inside BoxCheckbox
        <label className='group flex cursor-pointer items-center gap-spacing-5'>
            <BoxCheckbox checked={checked} onChange={onChange} />
            <Text variant='small'>{children}</Text>
        </label>
    );
}

/**
 * The semester to search, as a quiet button (like the calendar header's) that opens a list of them, rather than a
 * full-width field
 */
export function SemesterSelect({
    selectedOption,
    options,
    onChange,
    isLoading,
}: {
    selectedOption: DropdownOption | null;
    options: DropdownOption[];
    onChange: (option: DropdownOption) => void;
    isLoading: boolean;
}): JSX.Element {
    return (
        <Listbox<'div', DropdownOption | null>
            as='div'
            value={selectedOption}
            onChange={option => option && onChange(option)}
            by='id'
            className='relative'
        >
            <ListboxButton
                aria-label={`Semester: ${selectedOption?.label ?? 'none picked'}`}
                className='group h-[35px] flex cursor-pointer items-center gap-spacing-3 border-none rounded bg-transparent px-spacing-3 text-content btn-transition hover:bg-surface-hover active:scale-96 focusable'
            >
                <CalendarBlankIcon aria-hidden className='h-6 w-6' />
                <Text variant='small' className='whitespace-nowrap'>
                    {selectedOption?.label ?? (isLoading ? 'Loading semesters…' : 'Semester')}
                </Text>
                <CaretDownIcon aria-hidden className='h-4 w-4 transition-transform group-data-[open]:rotate-180' />
            </ListboxButton>
            {/* Rendered in place rather than anchored, which would portal it into a shadow root of its own */}
            <ListboxOptions
                transition
                className={clsx(
                    'absolute left-0 top-full z-50 mt-spacing-1 min-w-full flex flex-col p-spacing-1',
                    'origin-top-left rounded border border-divider bg-surface-raised text-content shadow-lg transition outline-none!',
                    'data-[closed]:(scale-95 opacity-0) data-[enter]:(duration-150 ease-out-expo) data-[leave]:(duration-50 ease-out)'
                )}
            >
                {options.length === 0 && (
                    <Text variant='small' className='whitespace-nowrap p-spacing-3 text-content-muted'>
                        {isLoading ? 'Loading semesters…' : 'No semesters found'}
                    </Text>
                )}
                {options.map(option => (
                    <ListboxOption
                        key={option.id}
                        value={option}
                        className='cursor-pointer select-none whitespace-nowrap rounded p-spacing-3 data-[focus]:bg-surface-hover data-[selected]:text-ut-burntorange'
                    >
                        <Text variant='small'>{option.label}</Text>
                    </ListboxOption>
                ))}
            </ListboxOptions>
        </Listbox>
    );
}
