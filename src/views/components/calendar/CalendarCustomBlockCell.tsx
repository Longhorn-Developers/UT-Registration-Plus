import type { CustomBlock } from '@shared/types/CustomBlock';
import Text from '@views/components/common/Text/Text';
import type { ComponentProps } from 'react';
import { formatBlockTime } from './customBlockUtils';

export default function CalendarCustomBlockCell({
    block,
    ...props
}: ComponentProps<'button'> & { block: CustomBlock }) {
    const time = block.allDay ? 'All day' : `${formatBlockTime(block.startTime)} – ${formatBlockTime(block.endTime)}`;
    return (
        <button
            {...props}
            type='button'
            aria-label={`${block.name}, ${time}`}
            className='box-border h-full w-full flex flex-col items-start overflow-hidden rounded border-0 border-l-3 border-solid border-sky-500 bg-sky-500/5 hover:bg-sky-500/15 text-theme-black text-left pl-[5px] pr-2 pt-1 focusable'
        >
            <Text as='div' variant='h1-course' className='w-full truncate font-bold! leading-[18px]!'>
                {block.name}
            </Text>
            <Text as='div' variant='small' className='w-full text-[12px]! font-normal! leading-[15px]! truncate'>
                {time}
            </Text>
        </button>
    );
}
