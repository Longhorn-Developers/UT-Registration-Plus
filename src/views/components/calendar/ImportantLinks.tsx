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
        text: "Spring '25 Course Schedule",
        url: 'https://utdirect.utexas.edu/apps/registrar/course_schedule/20252/',
    },
    {
        text: "Fall '24 Course Schedule",
        url: 'https://utdirect.utexas.edu/apps/registrar/course_schedule/20249/',
    },
    // {
    //     text: "Summer '24 Course Schedule",
    //     url: 'https://utdirect.utexas.edu/apps/registrar/course_schedule/20246/',
    // },
    {
        text: 'Registration Info Sheet',
        url: 'https://www.youtube.com/watch?v=xvFZjo5PgG0&pp=ygUJcmljayByb2xs',
    },
    {
        text: 'Register For Courses',
        url: 'https://www.youtube.com/watch?v=xvFZjo5PgG0&pp=ygUJcmljayByb2xs',
    },
    {
        text: 'Degree Audit',
        url: 'https://www.youtube.com/watch?v=xvFZjo5PgG0&pp=ygUJcmljayByb2xs',
    },
    {
        text: 'My Registered Courses',
        url: 'https://www.youtube.com/watch?v=xvFZjo5PgG0&pp=ygUJcmljayByb2xs',
    },
];

/**
 * The "Important Links" section of the calendar website
 * @returns
 */
export default function ImportantLinks({ className }: Props): JSX.Element {
    return (
        <article className={clsx(className, 'flex flex-col gap-2')}>
            <Text variant='h3'>Blehhhhh</Text>
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
