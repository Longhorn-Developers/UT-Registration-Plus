import { LockKey, Palette, PlusCircle, SelectionPlus } from '@phosphor-icons/react';
import { ExtensionStore } from '@shared/storage/ExtensionStore';
import Text from '@views/components/common/Text/Text';
import useWhatsNew from '@views/hooks/useWhatsNew';
import React, { useEffect } from 'react';

/**
 * WhatsNewPopupContent component.
 *
 * This component displays the content of the WhatsNew dialog.
 * It shows the new features that have been added to the extension.
 *
 * @returns A JSX of WhatsNewPopupContent component.
 */
export default function WhatsNewPopupContent(): JSX.Element {
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
                                <Text variant='p' className='text-ut-black'>
                                    {description}
                                </Text>
                            </div>
                        </div>
                    ))}
                </div>
                <img
                    // TODO: Replace with actual image/video
                    src='https://placehold.co/464x315'
                    alt='UT Registration Plus Demo'
                    className='border-ut-theme-offwhite1 max-w-[464px] w-full border rounded object-cover'
                />
            </div>
        </div>
    );
}

/**
 * WhatsNewDialog component.
 *
 * This component is responsible for checking if the extension has already been updated
 * and if so, it displays the WhatsNew dialog. Then it updates the state to show that the
 * dialog has been shown.
 *
 * @returns An empty fragment.
 *
 * @remarks
 * The component uses the `useWhatsNew` hook to show the WhatsNew dialog and the
 * `useEffect` hook to perform the check on component mount. It also uses the `ExtensionStore`
 * to view the state of the dialog.
 */
export function WhatsNewDialog(): JSX.Element {
    const showPopUp = useWhatsNew();

    useEffect(() => {
        const checkUpdate = async () => {
            const shown = await ExtensionStore.get('newFeaturesDialogShown');
            if (!shown) {
                ExtensionStore.set('newFeaturesDialogShown', true);
                showPopUp();
            }
        };

        checkUpdate();

        // This is on purpose
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // (not actually a useless fragment)
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <></>;
}
