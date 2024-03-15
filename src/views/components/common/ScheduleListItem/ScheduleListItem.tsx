import Text from '@views/components/common/Text/Text';
import useSchedules from '@views/hooks/useSchedules';
import clsx from 'clsx';
import React, { useMemo } from 'react';

import DragIndicatorIcon from '~icons/material-symbols/drag-indicator';

/**
 * Props for the ScheduleListItem component.
 */
export type Props = {
    style?: React.CSSProperties;
    name: string;
    dragHandleProps?: Omit<React.HTMLAttributes<HTMLDivElement>, 'className'>;
    onClick?: React.DOMAttributes<HTMLDivElement>['onClick'];
};

/**
 * This is a reusable dropdown component that can be used to toggle the visiblity of information
 */
export default function ScheduleListItem({ style, name, dragHandleProps, onClick }: Props): JSX.Element {
    const [activeSchedule] = useSchedules();

    const isActive = useMemo(() => activeSchedule.name === name, [activeSchedule, name]);

    return (
        <div style={{ ...style }} className='items-center rounded bg-white'>
            <li className='w-100% flex cursor-pointer items-center self-stretch justify-left text-ut-burntorange'>
                <div className='flex justify-center'>
                    <div
                        className='flex cursor-move items-center self-stretch rounded rounded-r-0'
                        {...dragHandleProps}
                    >
                        <DragIndicatorIcon className='h-6 w-6 cursor-move text-zinc-300 btn-transition -ml-1.5 hover:text-zinc-400' />
                    </div>
                    <div className='group inline-flex items-center justify-center gap-1.5' onClick={onClick}>
                        <div
                            className={clsx(
                                'h-5.5 w-5.5 relative border-2px border-current rounded-full btn-transition group-active:scale-95 after:(absolute content-empty bg-current h-2.9 w-2.9 rounded-full transition tansform scale-100 ease-out-expo duration-250 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2)',
                                {
                                    'after:(scale-0! opacity-0 ease-in-out! duration-200!)': !isActive,
                                }
                            )}
                        />
                        <Text variant='p'>{name}</Text>
                    </div>
                </div>
            </li>
        </div>
    );
}
