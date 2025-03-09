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
        text: "Fall '25 Course Schedule",
        url: 'https://utdirect.utexas.edu/apps/registrar/course_schedule/20259/',
    },
    {
        text: "Summer '25 Course Schedule",
        url: 'https://utdirect.utexas.edu/apps/registrar/course_schedule/20256/',
    },
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
 * The "Resources" section of the calendar website
 * @returns
 */
export default function ResourceLinks({ className }: Props): JSX.Element {
    return (
        <article className={clsx(className, 'flex flex-col gap-spacing-3')}>
            <Text className='text-theme-black uppercase' variant='h3'>
                RESOURCES
            </Text>
            <div className='flex flex-col gap-spacing-3'>
                {links.map(link => (
                    <a
                        key={link.text}
                        href={link.url}
                        className='flex items-center gap-spacing-2 text-ut-burntorange underline-offset-2 hover:underline'
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
