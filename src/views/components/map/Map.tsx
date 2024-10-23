import { Button } from '@views/components/common/Button';
import Divider from '@views/components/common/Divider';
import { LargeLogo } from '@views/components/common/LogoIcon';
import Text from '@views/components/common/Text/Text';
import useChangelog from '@views/hooks/useChangelog';
import React from 'react';

import IconoirGitFork from '~icons/iconoir/git-fork';

import CalendarFooter from '../calendar/CalendarFooter';
import { CalendarSchedules } from '../calendar/CalendarSchedules';
import ImportantLinks from '../calendar/ImportantLinks';
import TeamLinks from '../calendar/TeamLinks';
import CampusMap from './CampusMap';

const manifest = chrome.runtime.getManifest();
const LDIconURL = new URL('/src/assets/LD-icon.png', import.meta.url).href;
const UTMapURL = new URL('/src/assets/UT-Map.png', import.meta.url).href;

/**
 * Renders the map component for the UTRP (UT Registration Plus) extension.
 */
export default function Map(): JSX.Element {
    const handleChangelogOnClick = useChangelog();

    return (
        <div>
            <header className='flex items-center gap-5 overflow-x-auto overflow-y-hidden border-b border-ut-offwhite px-7 py-4 md:overflow-x-hidden'>
                <LargeLogo />
                <Divider className='mx-2 self-center md:mx-4' size='2.5rem' orientation='vertical' />
                <Text variant='h1' className='flex-1 text-ut-burntorange'>
                    UTRP Map
                </Text>
                <div className='hidden flex-row items-center justify-end gap-6 screenshot:hidden lg:flex'>
                    <Button variant='single' color='theme-black' onClick={handleChangelogOnClick}>
                        <IconoirGitFork className='h-6 w-6 text-ut-gray' />
                        <Text variant='small' className='text-ut-gray font-normal'>
                            v{manifest.version} - {process.env.NODE_ENV}
                        </Text>
                    </Button>
                    <img src={LDIconURL} alt='LD Icon' className='h-10 w-10 rounded-lg' />
                </div>
            </header>
            <div className='h-full flex flex-row'>
                <div className='h-full flex flex-none flex-col justify-between pb-5 screenshot:hidden'>
                    <div className='mb-3 h-full w-fit flex flex-col overflow-auto pb-2 pl-4.5 pr-4 pt-5'>
                        <CalendarSchedules />
                        <Divider orientation='horizontal' size='100%' className='my-5' />
                        <ImportantLinks />
                        <Divider orientation='horizontal' size='100%' className='my-5' />
                        <TeamLinks />
                    </div>
                    <CalendarFooter />
                </div>
                <div className='flex p-12'>
                    <CampusMap />
                </div>
            </div>
        </div>
    );
}
