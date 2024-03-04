import Text from '@views/components/common/Text/Text';
import clsx from 'clsx';
import React from 'react';

import DragIndicatorIcon from '~icons/material-symbols/drag-indicator';

/**
 * Props for the ScheduleListItem component.
 */
export type Props = {
    style?: React.CSSProperties;
    active?: boolean;
    name: string;
    dragHandleProps?: any;
    onClick?: (index) => void;
};

/**
 * This is a reusable dropdown component that can be used to toggle the visiblity of information
 */
export default function ScheduleListItem(props: Props) {
    const { dragHandleProps, onClick } = props;

    return (
        <div style={{ ...props.style }} className='items-center'>
            <li className='w-100% flex cursor-pointer items-center self-stretch justify-left text-ut-burntorange'>
                <div className='group flex justify-center'>
                    <div
                        className='flex cursor-move items-center self-stretch rounded rounded-r-0'
                        {...dragHandleProps}
                    >
                        <DragIndicatorIcon className='h-6 w-6 cursor-move text-zinc-300 btn-transition -ml-1.5 hover:text-zinc-400' />
                    </div>
                    <div className='inline-flex items-center justify-center gap-1.5'>
                        <div
                            className='h-5.5 w-5.5 flex items-center justify-center border-2px border-current rounded-full btn-transition group-active:scale-95'
                            onClick={onClick}
                        >
                            <div
                                className={clsx(
                                    'bg-current h-3 w-3 rounded-full transition tansform scale-100 ease-out-expo duration-250',
                                    {
                                        'scale-0! opacity-0 ease-in-out! duration-200!': !props.active,
                                    }
                                )}
                            />
                        </div>
                        <Text variant='p'>{props.name}</Text>
                    </div>
                </div>
            </li>
        </div>
    );
}
