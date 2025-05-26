import Text from '@views/components/common/Text/Text';
import React from 'react';

import { ForkKnife } from '@phosphor-icons/react';
import { AppStoreLogo } from '@phosphor-icons/react';
import { GooglePlayLogo } from '@phosphor-icons/react';

export const APP_STORE_URL = 'https://apps.apple.com/us/app/ut-dining/id6743042002';
const GOOGLE_PLAY_URL = ''; // Placeholder for Google Play URL, Android app not available yet

/**
 * Promotional component for the UT Dining app
 */
export default function DiningAppPromo() {
    return (
        <div className='flex items-center gap-spacing-3 p-spacing-4 border border-ut-offwhite/50 rounded min-w-[16.25rem] w-full'>
            <div className='flex items-center justify-center'>
                <ForkKnife className='w-6 h-6 text-ut-black' />
            </div>
            <div className='flex flex-col gap-spacing-1'>
                <Text as='p' variant='small' className='text-ut-black whitespace-normal'>
                    Download our new{' '}
                    <a
                        href={APP_STORE_URL}
                        target='_blank'
                        rel='noreferrer'
                        aria-label='UT Dining app'
                        className='text-ut-burntorange underline'
                    >
                        UT Dining app
                    </a>{' '}
                    to explore all dining options on campus!
                </Text>
                <div className='flex items-center gap-spacing-2 mt-spacing-2'>
                    <Text variant='mini' className='text-ut-black'>
                        Available on
                    </Text>
                    <a
                        href={APP_STORE_URL}
                        target='_blank'
                        rel='noreferrer'
                        aria-label='Download on App Store'
                        className='text-theme-black hover:text-ut-burntorange transition-colors'
                    >
                        <AppStoreLogo className='h-4.5 w-4.5' />
                    </a>
                    {/* <a
                        href={GOOGLE_PLAY_URL}
                        target='_blank'
                        rel='noreferrer'
                        aria-label='Download on Google Play'
                        className='text-theme-black hover:text-ut-burntorange transition-colors'
                    >
                        <GooglePlayLogo className='h-4.5 w-4.5' />
                    </a> */}
                </div>
            </div>
        </div>
    );
}
