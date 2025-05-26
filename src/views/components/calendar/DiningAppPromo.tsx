import { AppStoreLogo, ForkKnife, GooglePlayLogo, X } from '@phosphor-icons/react';
import { OptionsStore } from '@shared/storage/OptionsStore';
import { Button } from '@views/components/common/Button';
import Text from '@views/components/common/Text/Text';
import React, { useEffect, useState } from 'react';

export const APP_STORE_URL = 'https://apps.apple.com/us/app/ut-dining/id6743042002';
const GOOGLE_PLAY_URL = ''; // Placeholder for Google Play URL, Android app not available yet

interface DiningAppPromoProps {
    onClose: () => void;
}

/**
 * Promotional component for the UT Dining app
 */
export default function DiningAppPromo({ onClose }: DiningAppPromoProps) {
    return (
        <div className='relative min-w-[16.25rem] w-full flex items-center gap-spacing-3 border border-ut-offwhite/50 rounded p-spacing-4'>
            <div className='flex items-center justify-center'>
                <ForkKnife className='h-6 w-6 text-ut-black' />
            </div>
            <div className='flex flex-col gap-spacing-1'>
                <Text as='p' variant='small' className='whitespace-normal text-ut-black'>
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
                <div className='mt-spacing-2 flex items-center gap-spacing-2'>
                    <Text variant='mini' className='text-ut-black'>
                        Available on
                    </Text>
                    <a
                        href={APP_STORE_URL}
                        target='_blank'
                        rel='noreferrer'
                        aria-label='Download on App Store'
                        className='text-theme-black transition-colors hover:text-ut-burntorange'
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
            <Button
                variant='minimal'
                color='theme-black'
                onClick={onClose}
                className='absolute right-1 top-1 h-5 w-5 p-0'
                icon={X}
                aria-label='Close dining app promo'
                title='Close'
            />
        </div>
    );
}
