import type { CustomBlock } from '@shared/types/CustomBlock';
import Text from '@views/components/common/Text/Text';
import clsx from 'clsx';
import type { ComponentProps } from 'react';
import { formatBlockTime } from './customBlockUtils';

export default function CalendarCustomBlockCell({
    block,
    ...props
}: ComponentProps<'button'> & { block: CustomBlock }) {
    const time = block.allDay ? 'All day' : `${formatBlockTime(block.startTime)} – ${formatBlockTime(block.endTime)}`;
    const compact = !block.allDay && block.endTime - block.startTime <= 30;
    return (
        <button
            {...props}
            type='button'
            aria-label={`${block.name}, ${time}`}
            title={`${block.name}, ${time}`}
            className={clsx(
                'box-border h-full w-full flex overflow-hidden rounded border-0 border-l-3 border-solid border-sky-500 bg-sky-500/5 hover:bg-sky-500/15 text-theme-black text-left pl-[5px] pr-2 focusable',
                compact ? 'items-center gap-spacing-2' : 'flex-col items-start pt-1'
            )}
        >
            <Text
                as='div'
                variant='h1-course'
                className={clsx(
                    'truncate font-bold!',
                    compact ? 'min-w-0 flex-1 text-[12px]! leading-[14px]!' : 'w-full leading-[18px]!'
                )}
            >
                {block.name}
            </Text>
            <Text
                as='div'
                variant='small'
                className={clsx('text-[12px]! font-normal! leading-[14px]! truncate', compact ? 'shrink-0' : 'w-full')}
            >
                {compact ? formatBlockTime(block.startTime) : time}
            </Text>
        </button>
    );
}
