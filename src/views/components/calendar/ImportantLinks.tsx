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
        text: 'Course Schedule Archives',
        url: 'https://registrar.utexas.edu/schedules/archive',
    },
    {
        text: 'My Degree Audit (IDA)',
        url: 'https://utdirect.utexas.edu/apps/degree/audits/',
    },
    // {
    //     text: "Summer '24 Course Schedule",
    //     url: 'https://utdirect.utexas.edu/apps/registrar/course_schedule/20246/',
    // },
    // {
    //     text: "'24-'25 Academic Calendar",
    //     url: 'https://registrar.utexas.edu/calendars/24-25',
    // },
    {
        text: 'Registration Info Sheet (RIS)',
        url: 'https://utdirect.utexas.edu/registrar/ris.WBX',
    },
    {
        text: 'Register for Courses',
        url: 'https://utdirect.utexas.edu/registration/chooseSemester.WBX',
    },
];

/**
 * The "Important Links" section of the calendar website
 * @returns
 */
export default function ImportantLinks({ className }: Props): JSX.Element {
    return (
        <article className={clsx(className, 'flex flex-col gap-2.5')}>
            <Text variant='h3'>Resources</Text>
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
