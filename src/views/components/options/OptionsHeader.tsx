import { Status } from '@shared/types/Course';
import { Button } from '@views/components/common/Button';
import CourseStatus from '@views/components/common/CourseStatus';
import Divider from '@views/components/common/Divider';
import { LargeLogo } from '@views/components/common/LogoIcon';
import OptionsText from '@views/components/common/OptionsHeaderText';
import React from 'react';
import { LDIcon } from '../common/LDIcon';

/**
 * Renders the header component for the calendar.
 * @returns The JSX element representing the calendar header.
 */
export default function OptionsHeader(): JSX.Element {
    return (
        <div className='flex items-center gap-5 border-b border-ut-offwhite px-7 py-4'>
            <LargeLogo />
            <Divider className='mx-2 self-center md:mx-4' size='2.5rem' orientation='vertical' />
            <div className='flex-1 screenshot:transform-origin-left screenshot:scale-120'>
                <OptionsText optionsPageName={'UTRP Settings & Credits Page'} />
            </div>
            <div className='hidden flex-row items-center justify-end gap-6 screenshot:hidden lg:flex'>
                <LDIcon />
            </div>
        </div>
    );
}
