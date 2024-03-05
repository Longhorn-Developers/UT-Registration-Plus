import { Menu, Transition } from '@headlessui/react';
import Text from '@views/components/common/Text/Text';
import clsx from 'clsx';
import React from 'react';

import DragIndicatorIcon from '~icons/material-symbols/drag-indicator';
import MoreActionsIcon from '~icons/material-symbols/more-vert';

/**
 * Props for the ScheduleListItem component.
 */
export type Props = {
    style?: React.CSSProperties;
    active?: boolean;
    name: string;
    dragHandleProps?: any;
    onClick?: (index: number) => void;
};

/**
 * This is a reusable dropdown component that can be used to toggle the visibility of information.
 */
export default function ScheduleListItem(props: Props) {
    const { dragHandleProps, onClick } = props;

    const handleRename = () => {
        // Handle rename functionality
    };

    const handleDuplicate = () => {
        // Handle duplicate functionality
    };

    const handleDelete = () => {
        // Handle delete functionality
    };

    return (
        <div style={{ ...props.style }} className='items-center'>
            <li className='w-100% flex cursor-pointer items-center self-stretch justify-left text-ut-burntorange'>
                <div className='group flex justify-between items-center w-full'>
                    <div className='flex items-center'>
                        <div className='flex cursor-move items-center self-stretch rounded rounded-r-0' {...dragHandleProps}>
                            <DragIndicatorIcon className='h-6 w-6 cursor-move text-zinc-300 btn-transition -ml-1.5 hover:text-zinc-400' />
                        </div>
                        <div className='inline-flex items-center justify-center gap-1.5'>
                            <div className='h-5.5 w-5.5 flex items-center justify-center border-2px border-current rounded-full btn-transition group-active:scale-95'>
                                <div
                                    onClick={onClick}
                                    className={clsx(
                                        'bg-current h-3 w-3 rounded-full transition transform scale-100 ease-out-expo duration-250',
                                        {
                                            'scale-0! opacity-0 ease-in-out! duration-200!': !props.active,
                                        }
                                    )}
                                />
                            </div>
                            <div>
                                <Text variant='p'>{props.name}</Text>
                            </div>
                        </div>
                    </div>
                    <div className='relative'>
                        <Menu as='div'>
                            <Menu.Button as='div' className='bg-transparent'>
                                <MoreActionsIcon className='cursor-pointer text-blueGray rounded hover:border-blueGray hover:bg-blueGray hover:bg-opacity-25 h-6 w-6 btn-transition' />
                            </Menu.Button>
                            <Transition
                                as={React.Fragment}
                                enter='transition ease-out duration-100'
                                enterFrom='transform opacity-0 scale-95'
                                enterTo='transform opacity-100 scale-100'
                                leave='transition ease-in duration-75'
                                leaveFrom='transform opacity-100 scale-100'
                                leaveTo='transform opacity-0 scale-95'
                            >
                                <Menu.Items
                                    as='div'
                                    className='absolute right-0 mt-2 w-30 py-1 bg-white border border-gray-200 rounded shadow-lg text-black z-1'
                                >
                                    <Menu.Item>
                                        {({ active }) => (
                                            <Text className={`block px-4 py-1 ${active ? 'bg-gray-100' : ''}`}>Rename</Text>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <Text className={`block px-4 py-1 ${active ? 'bg-gray-100' : ''}`}>Duplicate</Text>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <Text className={`block px-4 py-1 ${active ? 'bg-gray-100 text-red-600' : 'text-red-600'}`}>Delete</Text>
                                        )}
                                    </Menu.Item>
                                </Menu.Items>
                            </Transition>
                        </Menu>
                    </div>
                </div>
            </li>
        </div>
    );
}
