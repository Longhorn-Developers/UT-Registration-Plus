import { GearSix } from '@phosphor-icons/react';
import { openTabFromContentScript } from '@views/lib/openNewTabFromContentScript';
import React from 'react';

import DiscordIcon from '~icons/bi/discord';
import GithubIcon from '~icons/ri/github-fill';
import InstagramIcon from '~icons/ri/instagram-line';
import LinkedinIcon from '~icons/ri/linkedin-box-fill';

import { Button } from '../common/Button';
import Link from '../common/Link';

interface SocialLink {
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    url: string;
}

const socialLinks: SocialLink[] = [
    {
        icon: InstagramIcon,
        url: 'https://www.instagram.com/longhorndevelopers',
    },
    {
        icon: DiscordIcon,
        url: 'https://discord.gg/7pQDBGdmb7',
    },
    {
        icon: GithubIcon,
        url: 'https://github.com/Longhorn-Developers',
    },
    {
        icon: LinkedinIcon,
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
                {socialLinks.map(({ icon: Icon, url }) => (
                    <Link className='linkanimate' href={url}>
                        <Icon className='h-6 w-6' />
                    </Link>
                ))}
            </div>
            <div>
                <Button
                    className='h-fit w-fit !p-0'
                    variant='minimal'
                    icon={GearSix}
                    color='ut-black'
                    onClick={handleOpenOptions}
                />
            </div>
        </footer>
    );
}
