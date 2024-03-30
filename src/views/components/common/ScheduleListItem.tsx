import { Menu } from '@headlessui/react';
import { Float } from '@headlessui-float/react';
import deleteSchedule from '@pages/background/lib/deleteSchedule';
import duplicateSchedule from '@pages/background/lib/duplicateSchedule';
import renameSchedule from '@pages/background/lib/renameSchedule';
import type { UserSchedule } from '@shared/types/UserSchedule';
import Text from '@views/components/common/Text/Text';
import useSchedules from '@views/hooks/useSchedules';
import clsx from 'clsx';
import React, { useEffect, useMemo, useState } from 'react';

import DragIndicatorIcon from '~icons/material-symbols/drag-indicator';
import MoreActionsIcon from '~icons/material-symbols/more-vert';

/**
 * Props for the ScheduleListItem component.
 */
export type Props = {
    style?: React.CSSProperties;
    schedule: UserSchedule;
    dragHandleProps?: Omit<React.HTMLAttributes<HTMLDivElement>, 'className'>;
    onClick?: React.DOMAttributes<HTMLDivElement>['onClick'];
};

/**
 * This is a reusable dropdown component that can be used to toggle the visiblity of information
 */
export default function ScheduleListItem({ schedule, dragHandleProps, onClick }: Props): JSX.Element {
    const [activeSchedule] = useSchedules();
    const [isEditing, setIsEditing] = useState(false);
    const [editorValue, setEditorValue] = useState(schedule.name);

    const editorRef = React.useRef<HTMLInputElement>(null);
    useEffect(() => {
        const editor = editorRef.current;
        setEditorValue(schedule.name);

        if (isEditing && editor) {
            editor.focus();
            editor.setSelectionRange(0, editor.value.length);
        }
    }, [isEditing, schedule.name, editorRef]);

    const isActive = useMemo(() => activeSchedule.id === schedule.id, [activeSchedule, schedule]);

    const handleBlur = async () => {
        if (editorValue.trim() !== '' && editorValue.trim() !== schedule.name) {
            schedule.name = (await renameSchedule(schedule.id, editorValue.trim())) as string;
        }
        setIsEditing(false);
    };

    return (
        <div className='rounded bg-white'>
            <li className='w-full flex cursor-pointer items-center text-ut-burntorange'>
                <div className='h-full cursor-move focusable' {...dragHandleProps}>
                    <DragIndicatorIcon className='h-6 w-6 cursor-move text-zinc-300 btn-transition -ml-1.5 hover:text-zinc-400' />
                </div>
                <div className='group flex flex-1 items-center overflow-x-hidden'>
                    <div
                        className='flex flex-grow items-center gap-1.5 overflow-x-hidden'
                        onClick={(...e) => !isEditing && onClick?.(...e)}
                    >
                        <div
                            className={clsx(
                                'h-5.5 w-5.5 relative border-2px border-current rounded-full btn-transition group-active:scale-95 after:(absolute content-empty bg-current h-2.9 w-2.9 rounded-full transition tansform-gpu scale-100 ease-out-expo duration-250 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2)',
                                {
                                    'after:(scale-0! opacity-0 ease-in-out! duration-200!)': !isActive,
                                }
                            )}
                        />
                        {isEditing && (
                            <Text
                                variant='p'
                                as='input'
                                className='mr-1 flex-1 px-0.5 outline-blue-500 -ml-0.5'
                                value={editorValue}
                                onChange={e => setEditorValue(e.target.value)}
                                onKeyDown={e => {
                                    if (e.key === 'Enter') handleBlur();
                                    if (e.key === 'Escape') {
                                        setIsEditing(false);
                                    }
                                }}
                                onBlur={handleBlur}
                                ref={editorRef}
                            />
                        )}
                        {!isEditing && (
                            <Text variant='p' className='flex-1 truncate' onDoubleClick={() => setIsEditing(true)}>
                                {schedule.name}
                            </Text>
                        )}
                    </div>
                    <div>
                        <Menu>
                            <Float
                                enter='transition ease-out duration-100'
                                enterFrom='transform opacity-0 scale-95'
                                enterTo='transform opacity-100 scale-100'
                                leave='transition ease-in duration-75'
                                leaveFrom='transform opacity-100 scale-100'
                                leaveTo='transform opacity-0 scale-95'
                                placement='bottom-end'
                                portal
                            >
                                <Menu.Button className='bg-white'>
                                    <MoreActionsIcon className='invisible h-5 w-5 cursor-pointer rounded text-blueGray btn-transition group-hover:visible group-hover:border-blueGray group-hover:bg-blueGray group-hover:bg-opacity-25 focusable' />
                                </Menu.Button>

                                <Menu.Items className='w-30 rounded bg-white py-1 text-black shadow-lg'>
                                    <Menu.Item as='div' onClick={() => setIsEditing(true)}>
                                        {({ active }) => (
                                            <Text className={`block px-4 py-1 ${active ? 'bg-gray-100' : ''}`}>
                                                Rename
                                            </Text>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item as='div' onClick={() => duplicateSchedule(schedule.name)}>
                                        {({ active }) => (
                                            <Text className={`block px-4 py-1 ${active ? 'bg-gray-100' : ''}`}>
                                                Duplicate
                                            </Text>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item as='div' onClick={() => deleteSchedule(schedule.id)}>
                                        {({ active }) => (
                                            <Text
                                                className={`block px-4 py-1 ${active ? 'bg-gray-100 text-red-600' : 'text-red-600'}`}
                                            >
                                                Delete
                                            </Text>
                                        )}
                                    </Menu.Item>
                                </Menu.Items>
                            </Float>
                        </Menu>
                    </div>
                </div>
            </li>
        </div>
    );
}
