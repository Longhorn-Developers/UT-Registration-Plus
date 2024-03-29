import React from 'react';

import DiscordIcon from '~icons/bi/discord';
import GithubIcon from '~icons/ri/github-fill';
import InstagramIcon from '~icons/ri/instagram-line';

import Link from '../common/Link';

/**
 * The footer section of the calendar's sidebar
 * @returns
 */
export default function CalendarFooter(): JSX.Element {
    return (
        <footer className='min-w-full w-0 space-y-2'>
            <div className='flex gap-2'>
                <Link className='linkanimate' href='#'>
                    <InstagramIcon className='h-6 w-6' />
                </Link>
                <Link className='linkanimate' href='https://discord.gg/bVh9g6VFwB'>
                    <DiscordIcon className='h-6 w-6' />
                </Link>
                <Link className='linkanimate' href='https://github.com/Longhorn-Developers/UT-Registration-Plus'>
                    <GithubIcon className='h-6 w-6' />
                </Link>
            </div>
            <p className='text-2.5 text-ut-concrete font-light tracking-wide'>
                UT Registration Plus is a project under Longhorn Developers, a student-led organization aimed at
                addressing issues at UT Austin.
            </p>
        </footer>
    );
}
