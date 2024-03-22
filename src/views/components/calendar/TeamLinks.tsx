import Text from '@views/components/common/Text/Text';
import clsx from 'clsx';
import React from 'react';

import OutwardArrowIcon from '~icons/material-symbols/arrow-outward';

type Props = {
    className?: string;
};

interface LinkItem {
    text: string;
    url: string;
}

const links: LinkItem[] = [
    {
        text: 'Feedback Form',
        url: '#',
    },
    {
        text: 'Apply to Longhorn Developers',
        url: '#',
    },
    {
        text: 'Become a Beta Tester',
        url: 'https://discord.gg/bVh9g6VFwB',
    },
];

/**
 * The "From The Team" section of the calendar website
 * @returns
 */
export default function TeamLinks({ className }: Props): JSX.Element {
    return (
        <article className={clsx(className, 'flex flex-col gap-2')}>
            <Text variant='h3'>From the Team</Text>
            {links.map(link => (
                <a
                    key={link.text}
                    href={link.url}
                    className='flex items-center gap-0.5 text-ut-burntorange underline-offset-2 hover:underline'
                    target='_blank'
                    rel='noreferrer'
                >
                    <Text variant='p'>{link.text}</Text>
                    <OutwardArrowIcon className='h-3 w-3' />
                </a>
            ))}
        </article>
    );
}
