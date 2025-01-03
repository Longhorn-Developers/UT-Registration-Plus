import type { Icon } from '@phosphor-icons/react';
import { DiscordLogo, GearSix, GithubLogo, InstagramLogo, LinkedinLogo } from '@phosphor-icons/react';
import { background } from '@shared/messages';
import { openTabFromContentScript } from '@views/lib/openNewTabFromContentScript';
import React from 'react';

import { Button } from '../common/Button';
import Link from '../common/Link';

interface SocialLink {
    icon: Icon;
    url: string;
}

const socialLinks: SocialLink[] = [
    {
        icon: InstagramLogo,
        url: 'https://www.instagram.com/longhorndevelopers',
    },
    {
        icon: DiscordLogo,
        url: 'https://discord.gg/7pQDBGdmb7',
    },
    {
        icon: GithubLogo,
        url: 'https://github.com/Longhorn-Developers',
    },
    {
        icon: LinkedinLogo,
        url: 'https://www.linkedin.com/company/longhorn-developers/posts/?feedView=all',
    },
];

/**
 * Opens the options page in a new tab.
 * @returns A promise that resolves when the options page is opened.
 */
const handleOpenOptions = async (): Promise<void> => {
    const url = chrome.runtime.getURL('/options.html');
    await openTabFromContentScript(url);
};

/**
 * The footer section of the calendar's sidebar
 * @returns
 */
export default function CalendarFooter(): JSX.Element {
    return (
        <footer className='min-w-full w-0 flex items-center justify-between bg-white px-spacing-8 pt-spacing-4'>
            <div className='flex gap-spacing-5'>
                {socialLinks.map(({ icon, url }) => (
                    <Link href={url}>
                        <Button className='h-fit !p-0' variant='single' icon={icon} color='ut-black' />
                    </Link>
                ))}
            </div>
            <div>
                <Button
                    className='h-fit !p-0'
                    variant='single'
                    icon={GearSix}
                    color='ut-black'
                    onClick={handleOpenOptions}
                />
            </div>
        </footer>
    );
}
