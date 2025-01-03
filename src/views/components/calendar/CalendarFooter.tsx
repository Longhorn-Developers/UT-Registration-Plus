import { openTabFromContentScript } from '@views/lib/openNewTabFromContentScript';
import React from 'react';

import DiscordIcon from '~icons/bi/discord';
import SettingsIcon from '~icons/material-symbols/settings';
import GithubIcon from '~icons/ri/github-fill';
import InstagramIcon from '~icons/ri/instagram-line';
import LinkedinIcon from '~icons/ri/linkedin-box-fill';

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
        <footer className='min-w-full w-0 flex items-center justify-between bg-white px-spacing7 py-spacing6 pt-spacing3'>
            <div className='flex gap-spacing4'>
                <Link className='linkanimate' href='https://www.instagram.com/longhorndevelopers'>
                    <InstagramIcon className='h-6 w-6 text-ut-black' />
                </Link>
                <Link className='linkanimate' href='https://discord.gg/7pQDBGdmb7'>
                    <DiscordIcon className='h-6 w-6 text-ut-black' />
                </Link>
                <Link className='linkanimate' href='https://github.com/Longhorn-Developers'>
                    <GithubIcon className='h-6 w-6 text-ut-black' />
                </Link>
                <Link
                    className='linkanimate'
                    href='https://www.linkedin.com/company/longhorn-developers/posts/?feedView=all'
                >
                    <LinkedinIcon className='h-6 w-6 text-ut-black -mx-0.75' />
                </Link>
            </div>
            <div>
                <Button
                    className='h-fit !p-0'
                    variant='single'
                    icon={SettingsIcon}
                    color='ut-black'
                    onClick={handleOpenOptions}
                />
            </div>
        </footer>
    );
}
