import { ExtensionStore } from '@shared/storage/ExtensionStore';
import Text from '@views/components/common/Text/Text';
import useWhatsNewPopUp from '@views/hooks/useWhatsNew';
import type { ComponentType, SVGProps } from 'react';
import { useEffect, useState } from 'react';
import ChartBarIcon from '~icons/ph/chart-bar';
import CloudXIcon from '~icons/ph/cloud-x';
import ListMagnifyingGlassIcon from '~icons/ph/lock';
import PlusIcon from '~icons/ph/plus-circle';

/**
 * This is the version of the 'What's New' features popup.
 *
 * It is used to check if the popup has already been shown to the user or not
 *
 * It should be incremented every time the "What's New" popup is updated.
 */
const WHATSNEW_POPUP_VERSION = 3;

const WHATSNEW_VIDEO_URL = 'https://cdn.longhorns.dev/quickaddhero.mp4';

type Feature = {
    id: string;
    icon: ComponentType<SVGProps<SVGSVGElement>>;
    title: string | JSX.Element;
    description: string;
};

const NEW_FEATURES = [
    {
        id: 'quick-add',
        icon: PlusIcon,
        title: 'Quick Add',
        description: 'Add courses by unique number without leaving the extension.',
    },
    {
        id: 'grade-distributions',
        icon: ChartBarIcon,
        title: 'Updated Grade Distributions',
        description: 'Now includes Summer and Fall 2025 grade distribution data.',
    },
    {
        id: 'course-status-checker',
        icon: ListMagnifyingGlassIcon,
        title: (
            <>
                Course Statuses
                <span className='mx-2 border border-ut-burntorange rounded px-2 py-0.5 text-xs text-ut-burntorange font-medium'>
                    BETA
                </span>
            </>
        ),
        description: 'See open, closed, and waitlisted statuses for your courses at a glance. (Enable in settings)',
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
    const [videoError, setVideoError] = useState(false);

    return (
        <div className='w-full flex flex-row justify-between'>
            <div className='w-full flex flex-col-reverse items-center justify-between gap-spacing-7 md:flex-row'>
                <div className='grid grid-cols-1 w-fit items-center gap-spacing-6 sm:grid-cols-2 md:w-lg md:flex md:flex-col md:flex-nowrap'>
                    {NEW_FEATURES.map(({ id, icon: Icon, title, description }) => (
                        <div key={id} className='w-full flex items-center justify-between gap-spacing-5'>
                            <Icon width='40' height='40' className='text-ut-burntorange' />
                            <div className='w-full flex flex-col gap-spacing-1'>
                                <Text variant='h4' as='h4' className='text-ut-burntorange font-bold!'>
                                    {title}
                                </Text>
                                <Text variant='p' as='p' className='text-ut-black'>
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
                                <CloudXIcon width={52} height={52} className='text-ut-black/50' />
                                <Text variant='h4' className='text-center text-ut-black/50'>
                                    Failed to load video. Please try again later.
                                </Text>
                            </div>
                        </div>
                    ) : (
                        <video
                            className='h-fit w-full flex items-center justify-center border border-ut-offwhite/50 rounded object-cover aspect-video'
                            autoPlay
                            loop
                            muted
                        >
                            <source src={WHATSNEW_VIDEO_URL} type='video/mp4' onError={() => setVideoError(true)} />
                        </video>
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

    // biome-ignore lint/correctness/useExhaustiveDependencies: This is on purpose
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
    }, []);

    return null;
}
