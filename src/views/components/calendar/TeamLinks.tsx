import Text from '@views/components/common/Text/Text';
import clsx from 'clsx';
import React from 'react';

import OutwardArrowIcon from '~icons/material-symbols/arrow-outward';

type Props = {
    className?: string;
};

/**
 * The "From The Team" section of the calendar website
 * @returns
 */
export default function TeamLinks({ className }: Props): JSX.Element {
    return (
        <article className={clsx(className, 'flex flex-col gap-2')}>
            <Text variant='h3'>From The Team</Text>
            <a
                href='options.html'
                className='flex items-center gap-0.5 text-ut-burntorange'
                target='_blank'
                rel='noreferrer'
            >
                <Text variant='p'>Credits – Meet the team!</Text>
                <OutwardArrowIcon className='h-3 w-3' />
            </a>
            {/* TODO: ADD THE LINK HERE */}
            <a
                href='application-link'
                className='flex items-center gap-0.5 text-ut-burntorange'
                target='_blank'
                rel='noreferrer'
            >
                <Text variant='p'>Apply to Longhorn Developers</Text>
                <OutwardArrowIcon className='h-3 w-3' />
            </a>
            {/* TODO: ADD THE LINK HERE */}
            <a
                href='beta_tester-link'
                className='flex items-center gap-0.5 text-ut-burntorange'
                target='_blank'
                rel='noreferrer'
            >
                <Text variant='p'>Become a Beta Tester</Text>
                <OutwardArrowIcon className='h-3 w-3' />
            </a>
        </article>
    );
}
