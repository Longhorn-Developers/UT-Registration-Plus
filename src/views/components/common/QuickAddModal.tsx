import { Input, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ChalkboardTeacher, GraduationCap, HashStraight, ListNumbers, Plus, PlusCircle } from '@phosphor-icons/react';
import { FIELDS_OF_STUDY } from '@shared/studyFields';
import clsx from 'clsx';
import React from 'react';

import { Button } from './Button';
import DialogProvider from './DialogProvider/DialogProvider';
import Divider from './Divider';
import type { DropdownOption } from './Dropdown';
import Dropdown from './Dropdown';
import { ExtensionRootWrapper, styleResetClass } from './ExtensionRoot/ExtensionRoot';
import Text from './Text/Text';

const COURSE_NUMBERS = [
    { id: '1', label: 'CS101' },
    { id: '2', label: 'MATH202' },
] as const satisfies DropdownOption[];

const SECTIONS = [
    { id: '1', label: 'Section A' },
    { id: '2', label: 'Section B' },
] as const satisfies DropdownOption[];

/**
 * QuickAddModal component
 *
 * This component renders a button with a PlusCircle icon and the label "Quick Add".
 */
export default function QuickAddModal(): JSX.Element {
    const [field, setField] = React.useState<DropdownOption | undefined>(undefined);
    const [courseNumber, setCourseNumber] = React.useState<DropdownOption | undefined>(undefined);
    const [section, setSection] = React.useState<DropdownOption | undefined>(undefined);
    const [unique, setUnique] = React.useState<string>('');

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
                                options={FIELDS_OF_STUDY}
                                selectedOption={field}
                                onOptionChange={f => {
                                    setField(f === field ? undefined : f);
                                    setCourseNumber(undefined);
                                    setSection(undefined);
                                }}
                                icon={GraduationCap}
                            />
                            <Dropdown
                                placeholderText='Select Course Number...'
                                options={COURSE_NUMBERS}
                                selectedOption={courseNumber}
                                onOptionChange={c => {
                                    setCourseNumber(c === courseNumber ? undefined : c);
                                    setSection(undefined);
                                }}
                                icon={ListNumbers}
                                disabled={!field}
                            />
                            <Dropdown
                                placeholderText='Select Section...'
                                options={SECTIONS}
                                selectedOption={section}
                                onOptionChange={s => setSection(s === section ? undefined : s)}
                                icon={ChalkboardTeacher}
                                disabled={!courseNumber}
                            />
                        </div>
                        <div className='w-full flex flex-row items-center justify-center gap-spacing-4'>
                            <Divider orientation='horizontal' size='100%' />
                            <Text className='w-fit text-nowrap uppercase' variant='small'>
                                OR ADD BY UNIQUE NUMBER
                            </Text>
                            <Divider orientation='horizontal' size='100%' />
                        </div>
                        <div className='h-9 w-full flex flex-row items-center justify-start gap-spacing-5'>
                            <HashStraight className='h-7 w-7' />
                            <Input
                                value={unique}
                                onChange={e => {
                                    if (e.target.value === '' || /^\d+$/.test(e.target.value)) {
                                        setUnique(e.target.value);
                                    }
                                }}
                                maxLength={5}
                                placeholder='Enter Unique Number...'
                                className='h-full w-full border border-ut-offwhite/50 border-rounded px-spacing-4 py-spacing-1 focus:border-ut-black/50 disabled:bg-ut-offwhite/20 focus:outline-none focus:ring-0'
                            />
                        </div>
                    </div>
                    <div className='w-full flex flex-row justify-end gap-spacing-5'>
                        <MenuItem>
                            {({ close }) => (
                                <Button
                                    color='ut-black'
                                    size='regular'
                                    variant='minimal'
                                    onClick={() => {
                                        setField(undefined);
                                        setCourseNumber(undefined);
                                        setSection(undefined);
                                        setUnique('');
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
                                setField(undefined);
                                setCourseNumber(undefined);
                                setSection(undefined);
                                setUnique('');
                            }}
                            disabled={!section && unique.length !== 5}
                        >
                            Add Course
                        </Button>
                    </div>
                </MenuItems>
            </Menu>
        </DialogProvider>
    );
}
