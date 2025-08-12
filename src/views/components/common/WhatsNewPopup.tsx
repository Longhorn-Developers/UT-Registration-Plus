import type { IconProps } from '@phosphor-icons/react';
import { CloudX, Coffee, ForkKnife, MapTrifold, Storefront } from '@phosphor-icons/react';
import { ExtensionStore } from '@shared/storage/ExtensionStore';
import { UT_DINING_PROMO_IMAGE_URL } from '@shared/util/appUrls';
import Text from '@views/components/common/Text/Text';
import useWhatsNewPopUp from '@views/hooks/useWhatsNew';
import React, { useEffect, useState } from 'react';

/**
 * This is the version of the 'What's New' features popup.
 *
 * It is used to check if the popup has already been shown to the user or not
 *
 * It should be incremented every time the "What's New" popup is updated.
 */
const WHATSNEW_POPUP_VERSION = 2;

// const WHATSNEW_VIDEO_URL = 'https://cdn.longhorns.dev/whats-new-v2.1.2.mp4';

type Feature = {
    id: string;
    icon: React.ForwardRefExoticComponent<IconProps>;
    title: string | JSX.Element;
    description: string;
};

const NEW_FEATURES = [
    {
        id: 'dining-halls-info',
        icon: ForkKnife,
        title: 'Dining Halls Info',
        description: 'See daily menus and nutritional deets for J2, JCL, and Kins',
    },
    {
        id: 'coffee-shops',
        icon: Coffee,
        title: 'Coffee Shops',
        description: 'Need a Coffee Fix? Check operating times for your favorite campus cafes.',
    },
    {
        id: 'convenience-stores',
        icon: Storefront,
        title: 'Convenience Stores',
        description: 'Find hours for quick snacks and essentials on campus.',
    },
    {
        id: 'microwave-map',
        icon: MapTrifold,
        title: 'Microwave Map',
        description: 'Need to heat up your lunch? Find microwaves across campus!',
    },
] as const satisfies readonly Feature[];

/**
 * WhatsNewPopupContent component.
 *
 * This component displays the content of the WhatsNew dialog.
 * It shows the new features that have been added to the extension.
 *
 * @returns A JSX of WhatsNewPopupContent component.
 */
export default function WhatsNewPopupContent(): JSX.Element {
    const [videoError, _setVideoError] = useState(false);

    return (
        <div className='w-full flex flex-row justify-between'>
            <div className='w-full flex flex-col-reverse items-center justify-between gap-spacing-7 md:flex-row'>
                <div className='grid grid-cols-1 w-fit items-center gap-spacing-6 sm:grid-cols-2 md:w-[277px] md:flex md:flex-col md:flex-nowrap'>
                    {NEW_FEATURES.map(({ id, icon: Icon, title, description }) => (
                        <div key={id} className='w-full flex items-center justify-between gap-spacing-5'>
                            <Icon width='40' height='40' className='text-ut-burntorange' />
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
                <div className='h-full max-w-[464px] w-full flex items-center justify-center'>
                    {videoError ? (
                        <div className='h-full w-full flex items-center justify-center border border-ut-offwhite/50 rounded'>
                            <div className='flex flex-col items-center justify-center p-spacing-2'>
                                <CloudX size={52} className='text-ut-black/50' />
                                <Text variant='h4' className='text-center text-ut-black/50'>
                                    Failed to load video. Please try again later.
                                </Text>
                            </div>
                        </div>
                    ) : (
                        <img
                            className='h-full w-full border border-ut-offwhite/50 rounded object-cover'
                            src={UT_DINING_PROMO_IMAGE_URL}
                            alt='UT Dining Promo'
                        />
                    )}
                </div>
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
export function WhatsNewDialog(): null {
    const showPopUp = useWhatsNewPopUp();

    useEffect(() => {
        const checkUpdate = async () => {
            const version = await ExtensionStore.get('lastWhatsNewPopupVersion');
            if (version !== WHATSNEW_POPUP_VERSION) {
                await ExtensionStore.set('lastWhatsNewPopupVersion', WHATSNEW_POPUP_VERSION);
                showPopUp();
            }
        };

        checkUpdate();

        // This is on purpose
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return null;
}
