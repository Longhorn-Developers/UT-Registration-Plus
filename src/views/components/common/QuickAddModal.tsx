import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ChalkboardTeacher, GraduationCap, HashStraight, ListNumbers, Plus, PlusCircle } from '@phosphor-icons/react';
import { FIELDS_OF_STUDY } from '@shared/studyFields';
import { useNumericInput, useQuickAddDropdowns } from '@views/hooks/useQuickAdd';
import clsx from 'clsx';
import React from 'react';

import { Button } from './Button';
import DialogProvider from './DialogProvider/DialogProvider';
import Divider from './Divider';
import type { DropdownOption } from './Dropdown';
import Dropdown from './Dropdown';
import { ExtensionRootWrapper, styleResetClass } from './ExtensionRoot/ExtensionRoot';
import Input from './Input';
import Text from './Text/Text';

const COURSE_NUMBERS = [
    { id: '1', label: 'CS101' },
    { id: '2', label: 'MATH202' },
] as const satisfies DropdownOption[];

const SECTIONS = [
    { id: '1', label: 'Section A' },
    { id: '2', label: 'Section B' },
] as const satisfies DropdownOption[];

const UNIQUE_ID_LENGTH = 5;

/**
 * QuickAddModal component
 *
 * This component renders a button with a PlusCircle icon and the label "Quick Add".
 */
export default function QuickAddModal(): JSX.Element {
    const uniqueNumber = useNumericInput('', UNIQUE_ID_LENGTH);
    const dropdowns = useQuickAddDropdowns(
        FIELDS_OF_STUDY,
        () => COURSE_NUMBERS,
        () => SECTIONS,
        () => uniqueNumber.reset()
    );

    return (
        <DialogProvider>
            <Menu>
                <MenuButton className='bg-transparent'>
                    <Button color='ut-black' size='small' variant='minimal' icon={PlusCircle}>
                        Quick Add
                    </Button>
                </MenuButton>
                <MenuItems
                    as={ExtensionRootWrapper}
                    className={clsx([
                        styleResetClass,
                        'mt-spacing-3',
                        'origin-top-left rounded bg-white text-black shadow-lg transition border border-ut-offwhite/50 focus:outline-none',
                        'data-[closed]:(opacity-0 scale-95)',
                        'data-[enter]:(ease-out-expo duration-150)',
                        'data-[leave]:(ease-out duration-50)',
                        'flex flex-col gap-spacing-7 px-spacing-7 py-spacing-6 w-[400px]',
                    ])}
                    transition
                    anchor='bottom start'
                >
                    <div className='flex flex-col gap-spacing-6'>
                        <div className='flex flex-col gap-spacing-5'>
                            <Dropdown
                                placeholderText='Select Field of Study...'
                                options={dropdowns.options.level1}
                                selectedOption={dropdowns.selections.level1}
                                onOptionChange={dropdowns.handleChange.level1}
                                disabled={dropdowns.disabled.level1}
                                icon={GraduationCap}
                            />
                            <Dropdown
                                placeholderText='Select Course Number...'
                                options={dropdowns.options.level2}
                                selectedOption={dropdowns.selections.level2}
                                onOptionChange={dropdowns.handleChange.level2}
                                disabled={dropdowns.disabled.level2}
                                icon={ListNumbers}
                            />
                            <Dropdown
                                placeholderText='Select Section...'
                                options={dropdowns.options.level3}
                                selectedOption={dropdowns.selections.level3}
                                onOptionChange={dropdowns.handleChange.level3}
                                disabled={dropdowns.disabled.level3}
                                icon={ChalkboardTeacher}
                            />
                        </div>
                        <div className='w-full flex flex-row items-center justify-center gap-spacing-4'>
                            <Divider orientation='horizontal' size='100%' />
                            <Text className='w-fit text-nowrap uppercase' variant='small'>
                                OR ADD BY UNIQUE NUMBER
                            </Text>
                            <Divider orientation='horizontal' size='100%' />
                        </div>
                        <Input
                            value={uniqueNumber.value}
                            onChange={uniqueNumber.handleChange}
                            maxLength={UNIQUE_ID_LENGTH}
                            placeholder='Enter Unique Number...'
                            icon={HashStraight}
                        />
                    </div>
                    <div className='w-full flex flex-row justify-end gap-spacing-5'>
                        <MenuItem>
                            {({ close }) => (
                                <Button
                                    color='ut-black'
                                    size='regular'
                                    variant='minimal'
                                    onClick={() => {
                                        uniqueNumber.reset();
                                        dropdowns.resetDropdowns();
                                        close();
                                    }}
                                >
                                    Cancel
                                </Button>
                            )}
                        </MenuItem>
                        <Button
                            color='ut-green'
                            size='regular'
                            variant='filled'
                            icon={Plus}
                            onClick={() => {
                                uniqueNumber.reset();
                                dropdowns.resetDropdowns();
                            }}
                            disabled={!dropdowns.selections.level3 && uniqueNumber.value.length !== UNIQUE_ID_LENGTH}
                        >
                            Add Course
                        </Button>
                    </div>
                </MenuItems>
            </Menu>
        </DialogProvider>
    );
}
