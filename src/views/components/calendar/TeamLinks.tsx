import { CRX_PAGES } from '@shared/types/CRXPages';
import { openReportWindow } from '@shared/util/openReportWindow';
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

const links = [
    {
        text: 'Rate us on Chrome Web Store',
        url: 'https://chromewebstore.google.com/detail/ut-registration-plus/hboadpjkoaieogjimneceaahlppnipaa',
    },
    {
        text: 'Send us Feedback & Ideas',
        url: CRX_PAGES.REPORT,
    },
    {
        text: 'Become a Beta Tester',
        url: 'https://forms.gle/Y9dmQAb1yzW5PRg48',
    },
    {
        text: 'Credits – Meet the team',
        url: CRX_PAGES.OPTIONS,
    },
    {
        text: 'Apply to Longhorn Developers',
        url: 'https://forms.gle/cdkLKmFwPmvHmiBe9',
    },
] as const satisfies LinkItem[];

/**
 * The "From The Team" section of the calendar website
 * @returns
 */
export default function TeamLinks({ className }: Props): JSX.Element {
    const handleClick = (link: LinkItem, event: React.MouseEvent) => {
        if (link.url === CRX_PAGES.REPORT) {
            event.preventDefault();
            openReportWindow();
        }
    };

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
                    onClick={event => handleClick(link, event)}
                >
                    <Text variant='p'>{link.text}</Text>
                    <OutwardArrowIcon className='h-3 w-3' />
                </a>
            ))}
        </article>
    );
}
