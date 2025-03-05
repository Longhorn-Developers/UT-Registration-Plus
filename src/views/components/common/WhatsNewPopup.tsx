import { Copy, Exam, MapPinArea, Palette } from '@phosphor-icons/react';
import { ExtensionStore } from '@shared/storage/ExtensionStore';
import Text from '@views/components/common/Text/Text';
import useWhatsNew from '@views/hooks/useWhatsNew';
import React, { useEffect } from 'react';

const WhatsNewVideoURL = new URL('/src/assets/whats-new.mp4', import.meta.url).href;

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
            id: 'quick-copy',
            icon: Copy,
            title: 'Quick Copy',
            description: 'Quickly copy a course unique number to your clipboard',
        },
        {
            id: 'updated-grades',
            icon: Exam,
            title: 'Updated Grades',
            description: 'Fall 2024 grades are now available in the grade distribution',
        },
        {
            id: 'ut-map',
            icon: MapPinArea,
            title: (
                <div className='flex flex-row items-center'>
                    UTRP Map
                    <span className='mx-2 border border-ut-burntorange rounded px-2 py-0.5 text-xs text-ut-burntorange font-medium'>
                        BETA
                    </span>
                </div>
            ),
            description: 'Find directions to your classes with our beta map feature in the settings page',
        },
    ];

    return (
        <div className='w-full flex flex-row justify-between'>
            <div className='w-full flex flex-row justify-between gap-spacing-7'>
                <div className='w-[277px] flex flex-col items-center gap-spacing-6'>
                    {newFeatures.map(({ id, icon: Icon, title, description }) => (
                        <div key={id} className='w-full flex items-center justify-between gap-spacing-5'>
                            <Icon width='32' height='32' className='text-ut-burntorange' />
                            <div className='w-full flex flex-col gap-spacing-1'>
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
                <video
                    className='border-ut-theme-offwhite1 max-w-[464px] w-full border rounded object-cover'
                    autoPlay
                    loop
                    muted
                >
                    <source src={WhatsNewVideoURL} type='video/mp4' />
                </video>
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
