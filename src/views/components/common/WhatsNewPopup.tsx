import { LockKey, Palette, PlusCircle, SelectionPlus } from '@phosphor-icons/react';
import Text from '@views/components/common/Text/Text';
import React from 'react';

const newFeatures = [
    {
        id: 'custom-course-colors',
        icon: Palette,
        title: 'Custom Course Colors',
        description: 'Paint your schedule in your favorite color theme',
    },
    {
        id: 'custom-blocks',
        icon: SelectionPlus,
        title: 'Custom Blocks',
        description: 'Reserve time for personal or work commitments',
    },
    {
        id: 'quick-add',
        icon: PlusCircle,
        title: 'Quick Add',
        description: 'Quickly add a course with the unique number and skip the course schedule',
    },
    {
        id: 'course-statuses',
        icon: LockKey,
        title: 'Course Statuses',
        description: 'Know when a course is waitlisted, closed, or cancelled',
    },
];

/**
 * A placeholder component for the what's new popup.
 *
 * @returns A JSX element representing the what's new popup.
 */
export default function WhatsNewPopup(): JSX.Element {
    return (
        <div className='w-full flex flex-row justify-between'>
            <div className='w-full flex flex-row justify-between'>
                <div className='w-[277px] flex flex-col items-center gap-spacing-6'>
                    {newFeatures.map(({ id, icon: Icon, title, description }) => (
                        <div key={id} className='w-full flex items-center justify-between gap-spacing-5'>
                            <Icon width='32' height='32' className='text-ut-burntorange' />
                            <div className='w-full flex flex-col gap-spacing-2'>
                                <Text variant='h4' className='text-ut-burntorange font-bold!'>
                                    {title}
                                </Text>
                                <Text variant='p' className='text-ut-black font-normal!'>
                                    {description}
                                </Text>
                            </div>
                        </div>
                    ))}
                </div>
                <img
                    src='images/UTRP-Demo.gif'
                    alt='UT Registration Plus Demo'
                    className='border-ut-theme-offwhite1 max-w-[464px] w-full border rounded object-cover'
                />
            </div>
        </div>
    );
}
