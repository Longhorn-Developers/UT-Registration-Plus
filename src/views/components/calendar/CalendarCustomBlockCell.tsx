import Text from '@views/components/common/Text/Text';
import clsx from 'clsx';
import React from 'react';

interface CalendarCustomBlockCellProps {
    title: string;
    time: string;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    className?: string;
}

/**
 * Weekday calendar cell for a user-defined time block (not a course).
 */
export default function CalendarCustomBlockCell({
    title,
    time,
    onClick,
    className,
}: CalendarCustomBlockCellProps): JSX.Element {
    return (
        <button
            type='button'
            onClick={onClick}
            className={clsx(
                'h-full w-full min-w-full flex cursor-pointer flex-col gap-0.25 overflow-hidden rounded border-l-4 border-l-ut-blue bg-ut-blue/[0.05] px-2 py-1.2 text-left transition-colors hover:bg-ut-blue/[0.15] screenshot:p-1.5',
                className
            )}
        >
            <Text variant='h1-course' as='p' className='truncate text-ut-black leading-tight!'>
                {title}
            </Text>
            <Text variant='h3-course' as='p' className='whitespace-pre-line text-ut-black'>
                {time}
            </Text>
        </button>
    );
}
