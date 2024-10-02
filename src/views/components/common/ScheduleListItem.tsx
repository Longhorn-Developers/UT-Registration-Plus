import deleteSchedule from '@pages/background/lib/deleteSchedule';
import renameSchedule from '@pages/background/lib/renameSchedule';
import type { UserSchedule } from '@shared/types/UserSchedule';
import Text from '@views/components/common/Text/Text';
import useSchedules from '@views/hooks/useSchedules';
import clsx from 'clsx';
import React, { useEffect, useMemo, useState } from 'react';

import XIcon from '~icons/material-symbols/close';
import DragIndicatorIcon from '~icons/material-symbols/drag-indicator';

import { Button } from './Button';
import PromptDialog from './Prompt';

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
    const [error, setError] = useState<string | undefined>(undefined);

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

    const handleBlur = () => {
        if (editorValue.trim() !== '') {
            schedule.name = editorValue.trim();
            renameSchedule(schedule.id, schedule.name);
        }

        setIsEditing(false);
    };

    const onDelete = () => {
        deleteSchedule(schedule.id).catch(e => setError(e.message));
    };

    return (
        <div className='rounded bg-white'>
            <PromptDialog
                isOpen={!!error}
                onClose={() => setError(undefined)}
                title={
                    <Text className='text-red' variant='h4'>
                        Something Went Wrong
                    </Text>
                }
                content={<Text variant='p'>{error}</Text>}
                // eslint-disable-next-line react/no-children-prop
                children={[
                    <Button key='yes' variant='filled' color='ut-black' onClick={() => setError(undefined)}>
                        I understand
                    </Button>,
                ]}
            />
            <li className='w-full flex cursor-pointer items-center text-ut-burntorange'>
                <div className='h-full cursor-move focusable' {...dragHandleProps}>
                    <DragIndicatorIcon className='h-6 w-6 cursor-move text-zinc-300 btn-transition -ml-1.5 hover:text-zinc-400' />
                </div>
                <div className='group relative flex flex-1 items-center overflow-x-hidden'>
                    <div
                        className='flex flex-grow items-center gap-1.5 overflow-x-hidden'
                        onClick={(...e) => !isEditing && onClick?.(...e)}
                    >
                        <div
                            className={clsx(
                                'h-5.5 w-5.5 relative flex-shrink-0 border-2px border-current rounded-full btn-transition group-active:scale-95 after:(absolute content-empty bg-current h-2.9 w-2.9 rounded-full transition transform-gpu scale-100 ease-out-expo duration-250 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2)',
                                {
                                    'after:(scale-0! opacity-0 ease-in-out! duration-200!)': !isActive,
                                }
                            )}
                        />
                        {isEditing && (
                            <Text
                                variant='p'
                                as='input'
                                className='max-w-[160px] flex-1 px-0.5 outline-blue-500 -ml-0.5'
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
                    <div className='flex flex-grow justify-end'>
                        <XIcon className='invisible h-5 w-5 text-ut-red group-hover:visible' onClick={onDelete} />
                    </div>
                </div>
            </li>
        </div>
    );
}
