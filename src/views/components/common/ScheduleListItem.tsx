import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import deleteSchedule from '@pages/background/lib/deleteSchedule';
import duplicateSchedule from '@pages/background/lib/duplicateSchedule';
import renameSchedule from '@pages/background/lib/renameSchedule';
import { Circle, DotsSixVertical, DotsThree, RadioButton } from '@phosphor-icons/react';
import type { UserSchedule } from '@shared/types/UserSchedule';
import Text from '@views/components/common/Text/Text';
import { useEnforceScheduleLimit } from '@views/hooks/useEnforceScheduleLimit';
import useSchedules from '@views/hooks/useSchedules';
import clsx from 'clsx';
import React, { useEffect, useMemo, useState } from 'react';

import { Button } from './Button';
import DialogProvider, { usePrompt } from './DialogProvider/DialogProvider';
import { ExtensionRootWrapper, styleResetClass } from './ExtensionRoot/ExtensionRoot';

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

    const showDialog = usePrompt();
    const enforceScheduleLimit = useEnforceScheduleLimit();
    const handleDuplicateSchedule = (scheduleId: string) => {
        if (enforceScheduleLimit()) {
            duplicateSchedule(scheduleId);
        }
    };

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

    const handleDelete = () => {
        showDialog({
            title: `Are you sure?`,
            description: (
                <>
                    <Text>Deleting</Text>
                    <Text className='text-ut-burntorange'> {schedule.name} </Text>
                    <Text>is permanent and will remove all added courses from that schedule.</Text>
                </>
            ),
            // eslint-disable-next-line react/no-unstable-nested-components
            buttons: close => (
                <>
                    <Button variant='single' color='ut-black' onClick={close}>
                        Cancel
                    </Button>
                    <Button
                        variant='filled'
                        color='theme-red'
                        onClick={() => {
                            close();
                            deleteSchedule(schedule.id);
                        }}
                    >
                        Delete Permanently
                    </Button>
                </>
            ),
        });
    };

    return (
        <div className='rounded bg-white'>
            <li className='w-full flex cursor-pointer items-center text-ut-burntorange'>
                <div className='h-full cursor-move focusable' {...dragHandleProps}>
                    <DotsSixVertical
                        weight='bold'
                        className='h-6 w-6 cursor-move text-zinc-300 btn-transition -ml-1.5 hover:text-zinc-400'
                    />
                </div>
                <div className='group relative flex flex-1 items-center overflow-x-hidden'>
                    <div
                        className='group/circle flex flex-grow items-center gap-1.5 overflow-x-hidden'
                        onClick={(...e) => !isEditing && onClick?.(...e)}
                    >
                        {isActive ? (
                            <RadioButton className='h-7.5 w-7.5 btn-transition active:scale-95' weight='fill' />
                        ) : (
                            <Circle className='h-7.5 w-7.5 btn-transition active:scale-95' />
                        )}
                        {isEditing && (
                            <Text
                                variant='p'
                                as='input'
                                className='mr-1 w-full flex-1 px-0.5 outline-blue-500 -ml-0.5'
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
                    <DialogProvider>
                        <Menu>
                            <MenuButton className='invisible h-fit bg-transparent p-0 text-ut-gray btn-transition data-[open]:visible group-hover:visible'>
                                <DotsThree weight='bold' className='h-6 w-6' />
                            </MenuButton>

                            <MenuItems
                                as={ExtensionRootWrapper}
                                className={clsx([
                                    styleResetClass,
                                    'w-30 cursor-pointer origin-top-right rounded bg-white p-1 text-black shadow-lg transition border border-ut-offwhite focus:outline-none',
                                    'data-[closed]:(opacity-0 scale-95)',
                                    'data-[enter]:(ease-out-expo duration-150)',
                                    'data-[leave]:(ease-out duration-50)',
                                ])}
                                transition
                                anchor='bottom end'
                            >
                                <MenuItem>
                                    <Text
                                        as='button'
                                        variant='small'
                                        onClick={() => setIsEditing(true)}
                                        className='w-full rounded bg-transparent p-2 text-left data-[focus]:bg-gray-200/40'
                                    >
                                        Rename
                                    </Text>
                                </MenuItem>
                                <MenuItem>
                                    <Text
                                        as='button'
                                        variant='small'
                                        onClick={() => handleDuplicateSchedule(schedule.id)}
                                        className='w-full rounded bg-transparent p-2 text-left data-[focus]:bg-gray-200/40'
                                    >
                                        Duplicate
                                    </Text>
                                </MenuItem>
                                <MenuItem>
                                    <Text
                                        as='button'
                                        variant='small'
                                        onClick={handleDelete}
                                        className='w-full rounded bg-transparent p-2 text-left text-theme-red data-[focus]:bg-red-200/40'
                                    >
                                        Delete
                                    </Text>
                                </MenuItem>
                            </MenuItems>
                        </Menu>
                    </DialogProvider>
                </div>
            </li>
        </div>
    );
}
