import React from 'react';

import DiscordIcon from '~icons/bi/discord';
import GithubIcon from '~icons/ri/github-fill';
import InstagramIcon from '~icons/ri/instagram-line';

import Link from '../common/Link';

/**
 * The footer section of the calendar's sidebar
 *
 * @param socialIconClassNames - Additional class names for the social icons container
 * @param sublineClassNames - Additional class names for the subline text
 * @returns
 */
export default function CalendarFooter({ socialIconClassNames = '', sublineClassNames = '' }): JSX.Element {
    return (
        <footer className='min-w-full w-0 pl-4.5 space-y-2'>
            <div className={`${socialIconClassNames} flex gap-2`}>
                <Link className='linkanimate' href='https://www.instagram.com/longhorndevelopers'>
                    <InstagramIcon className='h-6 w-6' />
                </Link>
                <Link className='linkanimate' href='https://discord.gg/7pQDBGdmb7'>
                    <DiscordIcon className='h-6 w-6' />
                </Link>
                <Link className='linkanimate' href='https://github.com/Longhorn-Developers'>
                    <GithubIcon className='h-6 w-6' />
                </Link>
            </div>
            <p className={`${sublineClassNames} text-2.5 text-ut-concrete font-light tracking-wide`}>
                UT Registration Plus is a project under Longhorn Developers, a student-led organization aimed at
                addressing issues at UT Austin.
            </p>
        </footer>
    );
}
