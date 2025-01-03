import { DiscordLogo, GearSix, GithubLogo, InstagramLogo, LinkedinLogo } from '@phosphor-icons/react';
import { openTabFromContentScript } from '@views/lib/openNewTabFromContentScript';
import React from 'react';

import { Button } from '../common/Button';
import Link from '../common/Link';

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
                <Link className='linkanimate' href='https://www.instagram.com/longhorndevelopers'>
                    <InstagramLogo className='h-6 w-6 text-ut-black' />
                </Link>
                <Link className='linkanimate' href='https://discord.gg/7pQDBGdmb7'>
                    <DiscordLogo className='h-6 w-6 text-ut-black' />
                </Link>
                <Link className='linkanimate' href='https://github.com/Longhorn-Developers'>
                    <GithubLogo className='h-6 w-6 text-ut-black' />
                </Link>
                <Link
                    className='linkanimate'
                    href='https://www.linkedin.com/company/longhorn-developers/posts/?feedView=all'
                >
                    <LinkedinLogo className='h-6 w-6 text-ut-black -mx-0.75' />
                </Link>
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
