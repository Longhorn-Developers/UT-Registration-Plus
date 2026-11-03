import Text from '@views/components/common/Text/Text';
import type React from 'react';

interface Props {
    titleText: string;
    bodyText: string;
}

/**
 * A maybe reusable InfoCard component that follows the design system of the extension.
 * @returns
 */
export default function InfoCard({ titleText, bodyText }: React.PropsWithChildren<Props>): React.JSX.Element {
    return (
        <div className='w-50 border border-divider rounded bg-surface-raised p-4'>
            <div className='flex flex-col gap-1.5'>
                <Text variant='h4' as='span' className='text-ut-orange dark:text-content'>
                    {titleText}
                </Text>
                <Text variant='small' as='span' className='text-content-muted'>
                    {bodyText}
                </Text>
            </div>
        </div>
    );
}
