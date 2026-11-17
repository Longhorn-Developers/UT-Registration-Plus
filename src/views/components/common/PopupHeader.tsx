import { background } from '@shared/messages';
import type { JSX, ReactNode } from 'react';
import CalendarDotsFillIcon from '~icons/ph/calendar-dots-fill';
import GearSixIcon from '~icons/ph/gear-six';

import { Button } from './Button';
import Divider from './Divider';
import { SmallLogo } from './LogoIcon';

/**
 * Props for PopupHeader
 */
export interface PopupHeaderProps {
    onCalendarOpen?: () => void;
    children?: ReactNode;
}

/**
 * The header shared by the extension popup and the registration page sidebar.
 *
 * @param onCalendarOpen - Called after the calendar tab is opened
 * @param children - Extra buttons, rendered between the calendar and settings buttons
 * @returns The rendered PopupHeader component
 */
export default function PopupHeader({ onCalendarOpen, children }: PopupHeaderProps): JSX.Element {
    const handleCalendarOpenOnClick = async () => {
        await background.switchToCalendarTab({});
        onCalendarOpen?.();
    };

    const handleOpenOptions = () => background.openNewTab({ url: chrome.runtime.getURL('/options.html') });

    return (
        <>
            <div className='flex items-center justify-between px-spacing-6 py-spacing-5'>
                <SmallLogo />
                <div className='flex items-center gap-1.5'>
                    <Button
                        variant='filled'
                        size='small'
                        color='ut-burntorange'
                        onClick={handleCalendarOpenOnClick}
                        icon={CalendarDotsFillIcon}
                    >
                        Calendar
                    </Button>
                    {children}
                    <Button
                        variant='minimal'
                        size='small'
                        color='ut-black'
                        title='Settings'
                        className='!text-content-muted'
                        onClick={handleOpenOptions}
                        icon={GearSixIcon}
                    />
                </div>
            </div>
            <Divider className='bg-divider/50' orientation='horizontal' size='100%' />
        </>
    );
}
