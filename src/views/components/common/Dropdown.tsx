import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import type { Icon, IconProps } from '@phosphor-icons/react';
import { CaretDown } from '@phosphor-icons/react';
import { ellipsify } from '@shared/util/string';
import Text from '@views/components/common/Text/Text';
import clsx from 'clsx';
import React from 'react';

import { ExtensionRootWrapper, styleResetClass } from './ExtensionRoot/ExtensionRoot';

/**
 * Type for the dropdown option.
 */
export type DropdownOption = {
    id: string;
    label: string;
};

interface Props {
    className?: string;
    placeholderText?: string;
    options?: readonly DropdownOption[];
    selectedOption: DropdownOption | undefined;
    onOptionChange?: (newOption: DropdownOption) => void;
    icon?: Icon;
    iconProps?: IconProps;
    disabled?: boolean;
}

/**
 * A reusable dropdown component that follows the design system of the extension.
 * @returns
 */
export default function Dropdown({
    className,
    placeholderText,
    options,
    selectedOption,
    onOptionChange,
    icon,
    iconProps,
    disabled,
}: React.PropsWithChildren<Props>): JSX.Element {
    const Icon = icon;
    return (
        <Listbox
            as='div'
            value={selectedOption}
            onChange={onOptionChange}
            className={clsx('h-9 w-full flex flex-row items-center justify-between gap-spacing-5', className)}
        >
            <div className='h-7 w-7'>
                {Icon && <Icon {...iconProps} className={clsx('h-7 w-7', iconProps?.className)} />}
            </div>
            <ListboxButton
                className={clsx(
                    'flex h-full w-full flex-row items-center justify-between gap-spacing-3 px-spacing-4',
                    'border border-ut-offwhite/50 border-rounded bg-transparent disabled:bg-ut-offwhite/20'
                )}
                disabled={disabled}
            >
                <div className='h-full w-full flex flex-row items-center justify-between gap-spacing-3'>
                    {selectedOption ? (
                        <Text className='truncate text-ut-black'>{ellipsify(selectedOption.label, 27)}</Text>
                    ) : (
                        placeholderText && <Text className='text-ut-black/50'>{placeholderText}</Text>
                    )}
                    <CaretDown className='h-5 w-5' />
                </div>
            </ListboxButton>
            <ListboxOptions
                as={ExtensionRootWrapper}
                anchor='bottom start'
                className={clsx(
                    styleResetClass,
                    'flex flex-col p-spacing-1 w-[306px]',
                    'origin-top-right rounded bg-white text-black shadow-lg transition border border-ut-offwhite/50 focus:outline-none',
                    'data-[closed]:(opacity-0 scale-95)',
                    'data-[enter]:(ease-out-expo duration-150)',
                    'data-[leave]:(ease-out duration-50)',
                    {
                        'h-fit': !options || options?.length < 5,
                        'h-[200px] overflow-y-auto': options && options?.length >= 5,
                    }
                )}
            >
                {options?.map(option => (
                    <ListboxOption
                        key={option.id}
                        value={option}
                        className={clsx(
                            'cursor-pointer select-none rounded p-spacing-3 text-ut-black/80',
                            'data-[focus]:bg-ut-offwhite/20',
                            'data-[disabled]:text-ut-black/50',
                            'data-[disabled]:cursor-not-allowed'
                        )}
                    >
                        <Text>{option.label}</Text>
                    </ListboxOption>
                ))}
            </ListboxOptions>
        </Listbox>
    );
}
