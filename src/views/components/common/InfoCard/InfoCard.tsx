import Text from '@views/components/common/Text/Text';
import React from 'react';

interface Props {
    titleText: string;
    bodyText: string;
}

/**
 * A maybe reusable InfoCard component that follows the design system of the extension.
 * @returns
 */
export default function InfoCard({ titleText, bodyText }: React.PropsWithChildren<Props>): JSX.Element {
    return (
        <div className='w-50 border rounded p-4 border-gray-300 bg-white'>
            <div className='flex flex-col gap-1.5'>
                <Text variant='h4' as='span' className='text-ut-orange'>
                    {titleText}
                </Text>
                <Text variant='small' as='span' className='text-ut-black'>
                    {bodyText}
                </Text>
            </div>
        </div>
    );
}
