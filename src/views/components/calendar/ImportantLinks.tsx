import Text from '@views/components/common/Text/Text';
import clsx from 'clsx';
import type { JSX } from 'react';
import ArrowUpRightIcon from '~icons/ph/arrow-up-right';

type Props = {
    className?: string;
};

interface LinkItem {
    text: string;
    url: string;
}

const links: LinkItem[] = [
    // {
    //     text: "Fall '25 Course Schedule",
    //     url: 'https://utdirect.utexas.edu/apps/registrar/course_schedule/20259/',
    // },
    // {
    //     text: 'Course Schedule Archives',
    //     url: 'https://registrar.utexas.edu/schedules/archive',
    // },
    {
        text: "Spring '27 Course Schedule",
        url: 'https://utdirect.utexas.edu/apps/registrar/course_schedule/20272/',
    },
    {
        text: "Fall '26 Course Schedule",
        url: 'https://utdirect.utexas.edu/apps/registrar/course_schedule/20269/',
    },
    {
        text: "Summer '26 Course Schedule",
        url: 'https://utdirect.utexas.edu/apps/registrar/course_schedule/20266/',
    },
    {
        text: "Spring '26 Course Schedule",
        url: 'https://utdirect.utexas.edu/apps/registrar/course_schedule/20262/',
    },
    {
        text: 'Other Course Schedules',
        url: 'https://registrar.utexas.edu/schedules',
    },
    {
        text: 'My Degree Audit (IDA)',
        url: 'https://utdirect.utexas.edu/apps/degree/audits/',
    },
    {
        text: "'26–'27 Academic Calendar",
        url: 'https://registrar.utexas.edu/calendars/26-27',
    },
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
        <article className={clsx(className, 'flex flex-col gap-2')}>
            <Text className='text-content-muted' variant='h3'>
                Useful Links
            </Text>
            {links.map(link => (
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
