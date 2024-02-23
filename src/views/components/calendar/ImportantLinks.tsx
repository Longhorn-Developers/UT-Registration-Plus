import clsx from 'clsx';
import React from 'react';

import OutwardArrowIcon from '~icons/material-symbols/arrow-outward';

import Text from '../common/Text/Text';

type Props = {
    className?: string;
};

/**
 * The "Important Links" section of the calendar website
 * @returns
 */
export default function ImportantLinks({ className }: Props) {
    return (
        <article className={clsx(className, 'flex flex-col gap-2')}>
            <Text variant='h3'>Important Links</Text>
            <a
                href='https://utdirect.utexas.edu/apps/registrar/course_schedule/20242/'
                className='flex items-center gap-0.5 text-ut-burntorange'
                target='_blank'
                rel='noreferrer'
            >
                <Text variant='p'>Spring Course Schedule</Text>
                <OutwardArrowIcon className='h-3 w-3' />
            </a>
            <a
                href='https://utdirect.utexas.edu/apps/registrar/course_schedule/20236/'
                className='flex items-center gap-0.5 text-ut-burntorange'
                target='_blank'
                rel='noreferrer'
            >
                <Text variant='p'>Summer Course Schedule</Text>
                <OutwardArrowIcon className='h-3 w-3' />
            </a>
            <a
                href='https://utdirect.utexas.edu/registrar/ris.WBX'
                className='flex items-center gap-0.5 text-ut-burntorange'
                target='_blank'
                rel='noreferrer'
            >
                <Text variant='p'>Registration Info Sheet</Text>
                <OutwardArrowIcon className='h-3 w-3' />
            </a>
            <a
                href='https://utdirect.utexas.edu/registration/chooseSemester.WBX'
                className='flex items-center gap-0.5 text-ut-burntorange'
                target='_blank'
                rel='noreferrer'
            >
                <Text variant='p'>Register For Courses</Text>
                <OutwardArrowIcon className='h-3 w-3' />
            </a>
            <a
                href='https://utdirect.utexas.edu/apps/degree/audits/'
                className='flex items-center gap-0.5 text-ut-burntorange'
                target='_blank'
                rel='noreferrer'
            >
                <Text variant='p'>Degree Audit</Text>
                <OutwardArrowIcon className='h-3 w-3' />
            </a>
        </article>
    );
}
