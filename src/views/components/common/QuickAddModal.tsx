import { Listbox, ListboxButton, Menu, MenuButton, MenuItems } from '@headlessui/react';
import { CaretDown, GraduationCap, Plus, PlusCircle } from '@phosphor-icons/react';
import clsx from 'clsx';
import React from 'react';

import { Button } from './Button';
import DialogProvider from './DialogProvider/DialogProvider';
import Divider from './Divider';
import { ExtensionRootWrapper, styleResetClass } from './ExtensionRoot/ExtensionRoot';
import Text from './Text/Text';

/**
 * QuickAddModal component
 *
 * This component renders a button with a PlusCircle icon and the label "Quick Add".
 */
export default function QuickAddModal(): JSX.Element {
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
                        'min-w-max origin-top-right rounded bg-white text-black shadow-lg transition border border-ut-offwhite/50 focus:outline-none',
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
                            <div className='h-[35px] w-full flex flex-row gap-spacing-5'>
                                <GraduationCap size='28' className='self-center' />
                                <Listbox>
                                    <ListboxButton className='h-full w-full flex flex-row items-center justify-between border border-rounded bg-ut-offwhite/25 px-spacing-4'>
                                        <Text className='text-ut-black/50'>Select Field of Study...</Text>
                                        <CaretDown size='20' className='self-center text-ut-black' />
                                    </ListboxButton>
                                </Listbox>
                            </div>
                            <Text>Select Field of Study</Text>
                            <Text>Course Number</Text>
                            <Text>Select Section</Text>
                        </div>
                        <div className='w-full flex flex-row items-center justify-center gap-spacing-4'>
                            <Divider orientation='horizontal' size='100%' />
                            <Text className='w-fit text-nowrap uppercase' variant='small'>
                                OR ADD BY UNIQUE NUMBER
                            </Text>
                            <Divider orientation='horizontal' size='100%' />
                        </div>
                        <div>
                            <Text>Unique ID</Text>
                        </div>
                    </div>
                    <div className='w-full flex flex-row justify-end gap-spacing-5'>
                        <Button color='ut-black' size='regular' variant='minimal'>
                            Cancel
                        </Button>
                        <Button color='ut-green' size='regular' variant='filled' icon={Plus}>
                            Add Course
                        </Button>
                    </div>
                </MenuItems>
            </Menu>
        </DialogProvider>
    );
}
