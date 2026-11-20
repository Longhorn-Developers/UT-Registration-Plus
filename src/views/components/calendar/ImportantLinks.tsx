import Text from '@views/components/common/Text/Text';
import clsx from 'clsx';
import type { JSX } from 'react';
import ArrowUpRightIcon from '~icons/ph/arrow-up-right';
import { USEFUL_LINKS } from './usefulLinks';

type Props = {
    className?: string;
};

/**
 * The "Important Links" section of the calendar website
 * @returns
 */
export default function ImportantLinks({ className }: Props): JSX.Element {
    return (
        <article className={clsx(className, 'flex flex-col gap-2')}>
            <Text className='text-content-muted' variant='h3'>
                Useful Links
            </Text>
            {USEFUL_LINKS.map(link => (
                <a
                    key={link.text}
                    href={link.url}
                    className='flex items-center gap-0.5 text-ut-burntorange dark:text-content underline-offset-2 hover:underline'
                    target='_blank'
                    rel='noreferrer'
                >
                    <Text variant='p'>{link.text}</Text>
                    <ArrowUpRightIcon className='h-4 w-4' />
                </a>
            ))}
        </article>
    );
}
