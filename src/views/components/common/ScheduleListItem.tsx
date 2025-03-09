import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import deleteSchedule from '@pages/background/lib/deleteSchedule';
import duplicateSchedule from '@pages/background/lib/duplicateSchedule';
import renameSchedule from '@pages/background/lib/renameSchedule';
import {
    Circle,
    CopySimple,
    DotsSixVertical,
    DotsThree,
    PencilSimpleLine,
    RadioButton,
    Trash,
} from '@phosphor-icons/react';
import { background } from '@shared/messages';
import type { UserSchedule } from '@shared/types/UserSchedule';
import Text from '@views/components/common/Text/Text';
import { useEnforceScheduleLimit } from '@views/hooks/useEnforceScheduleLimit';
import useSchedules from '@views/hooks/useSchedules';
import { LONGHORN_DEVELOPERS_ADMINS, LONGHORN_DEVELOPERS_SWE } from '@views/lib/getGitHubStats';
import clsx from 'clsx';
import React, { useEffect, useMemo, useState } from 'react';

import { Button } from './Button';
import DialogProvider, { usePrompt } from './DialogProvider/DialogProvider';
import { ExtensionRootWrapper, styleResetClass } from './ExtensionRoot/ExtensionRoot';
import Link from './Link';
import { SortableListDragHandle } from './SortableListDragHandle';

/**
 * Props for the ScheduleListItem component.
 */
interface ScheduleListItemProps {
    schedule: UserSchedule;
    onClick?: React.DOMAttributes<HTMLDivElement>['onClick'];
}

const IS_STORYBOOK = import.meta.env.STORYBOOK;
const teamMembers = [...LONGHORN_DEVELOPERS_ADMINS, ...LONGHORN_DEVELOPERS_SWE];

/**
 * This is a reusable dropdown component that can be used to toggle the visiblity of information
 */
export default function ScheduleListItem({ schedule, onClick }: ScheduleListItemProps): JSX.Element {
    const [activeSchedule] = useSchedules();
    const [isEditing, setIsEditing] = useState(false);
    const [editorValue, setEditorValue] = useState(schedule.name);
    const teamMember = teamMembers[Math.floor(Math.random() * teamMembers.length)];

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

            if (schedule.name === '404') {
                const url = chrome.runtime.getURL('/404.html');
                background.openNewTab({ url });
            }

            if (Math.random() < 0.002) {
                showDialog({
                    title: 'Schedule name already taken',
                    description: (
                        <>
                            <Text>Schedule name</Text>
                            <Text className='text-ut-burntorange'> {schedule.name} </Text>
                            <Text>
                                is already taken.
                                <br />
                                <br />
                                Join the&nbsp;
                            </Text>
                            <Link className='link' href='https://discord.gg/7pQDBGdmb7'>
                                <Text>Discord</Text>
                            </Link>
                            <Text> to contact {teamMember?.name as string}.</Text>
                        </>
                    ),
                    // eslint-disable-next-line react/no-unstable-nested-components
                    buttons: close => (
                        <Button variant='minimal' color='ut-black' onClick={close}>
                            Go Back
                        </Button>
                    ),
                });
            }
        }
        setIsEditing(false);
    };

    const handleDelete = () => {
        showDialog({
            title: 'Delete schedule?',
            description: (
                <>
                    <Text>Deleting </Text>
                    <Text className='text-ut-burntorange'>{schedule.name}</Text>
                    <Text> is permanent and will remove all added courses from </Text>
                    <Text className='text-ut-burntorange'>{schedule.name}</Text>
                    <Text>.</Text>
                </>
            ),
            // eslint-disable-next-line react/no-unstable-nested-components
            buttons: close => (
                <>
                    <Button variant='minimal' color='ut-black' onClick={close}>
                        Cancel
                    </Button>
                    <Button
                        variant='filled'
                        color='theme-red'
                        icon={Trash}
                        onClick={() => {
                            close();
                            deleteSchedule(schedule.id);
                        }}
                    >
                        Delete permanently
                    </Button>
                </>
            ),
        });
    };

    return (
        <div className='h-7.5 rounded bg-white'>
            <div className='h-full w-full flex cursor-pointer items-center gap-[1px] text-ut-burntorange'>
                {IS_STORYBOOK ? (
                    <DotsSixVertical
                        weight='bold'
                        className='h-6 w-6 cursor-move text-zinc-300 btn-transition -ml-1.5 hover:text-zinc-400'
                    />
                ) : (
                    <SortableListDragHandle className='flex cursor-move items-center justify-center'>
                        <DotsSixVertical
                            weight='bold'
                            className='h-6 w-6 cursor-move text-zinc-300 btn-transition -ml-1.5 hover:text-zinc-400'
                        />
                    </SortableListDragHandle>
                )}
                <div className='group relative flex flex-1 items-center overflow-x-hidden'>
                    <div
                        className='group/circle flex flex-grow items-center gap-spacing-3 overflow-x-hidden'
                        onClick={(...e) => !isEditing && onClick?.(...e)}
                    >
                        {isActive ? (
                            <RadioButton
                                className='h-7.5 w-7.5 shrink-0 btn-transition active:scale-95'
                                weight='fill'
                            />
                        ) : (
                            <Circle className='h-7.5 w-7.5 shrink-0 btn-transition active:scale-95' />
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
                            <Text
                                variant='p'
                                className='flex-1 select-none truncate'
                                onDoubleClick={() => setIsEditing(true)}
                            >
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
                                    'w-fit cursor-pointer origin-top-right rounded bg-white p-1 text-black shadow-lg transition border border-ut-offwhite/50 focus:outline-none',
                                    'data-[closed]:(opacity-0 scale-95)',
                                    'data-[enter]:(ease-out-expo duration-150)',
                                    'data-[leave]:(ease-out duration-50)',
                                ])}
                                transition
                                anchor='bottom end'
                            >
                                <MenuItem>
                                    <Button
                                        className='w-full flex justify-start'
                                        onClick={() => setIsEditing(true)}
                                        color='ut-black'
                                        size='small'
                                        variant='minimal'
                                        icon={PencilSimpleLine}
                                    >
                                        Rename
                                    </Button>
                                </MenuItem>
                                <MenuItem>
                                    <Button
                                        className='w-full flex justify-start'
                                        onClick={() => handleDuplicateSchedule(schedule.id)}
                                        color='ut-black'
                                        size='small'
                                        variant='minimal'
                                        icon={CopySimple}
                                    >
                                        Duplicate
                                    </Button>
                                </MenuItem>
                                <MenuItem>
                                    <Button
                                        className='w-full flex justify-start'
                                        onClick={handleDelete}
                                        color='theme-red'
                                        size='small'
                                        variant='minimal'
                                        icon={Trash}
                                    >
                                        Delete Schedule
                                    </Button>
                                </MenuItem>
                            </MenuItems>
                        </Menu>
                    </DialogProvider>
                </div>
            </div>
        </div>
    );
}
