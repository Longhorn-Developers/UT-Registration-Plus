import Text from '@views/components/common/Text/Text';
import clsx from 'clsx';
import type { JSX } from 'react';
import OutwardArrowIcon from '~icons/material-symbols/arrow-outward';
import { USEFUL_LINKS } from './usefulLinks';

type Props = {
    className?: string;
};

/**
 * The "Resources" section of the calendar website
 * @returns
 */
export default function ResourceLinks({ className }: Props): JSX.Element {
    return (
        <article className={clsx(className, 'flex flex-col gap-spacing-3')}>
            <Text className='text-content uppercase' variant='h3'>
                RESOURCES
            </Text>
            <div className='flex flex-col gap-spacing-3'>
                {USEFUL_LINKS.map(link => (
                    <a
                        key={link.text}
                        href={link.url}
                        className='flex items-center gap-spacing-2 text-ut-burntorange dark:text-content underline-offset-2 hover:underline'
                        target='_blank'
                        rel='noreferrer'
                    >
                        <Text variant='p'>{link.text}</Text>
                        <OutwardArrowIcon className='h-4 w-4' />
                    </a>
                ))}
            </div>
        </article>
    );
}
