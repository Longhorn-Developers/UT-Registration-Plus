import type { PropsWithChildren } from 'react';
import React from 'react';

/**
 * Props for the Preview component.
 */
export interface PreviewProps {
    // className?: string;
}

/**
 * Renders a preview component.
 *
 * @component
 * @param {PropsWithChildren<PreviewProps>} props - The component props.
 * @returns {JSX.Element} The rendered preview component.
 */
export default function Preview(props: PropsWithChildren<PreviewProps>): JSX.Element {
    const { children } = props;
    return (
        <div className='w-1/2 inline-flex flex-col items-start justify-start rounded-xl bg-ut-gray/10'>
            <div className='m-2 inline-flex items-center self-stretch justify-end gap-2.5'>
                <div className='text-center text-sm text-ut-gray font-medium'>Preview</div>
            </div>
            <div className='flex flex-col self-stretch px-5 pb-5 space-y-2'>{children}</div>
        </div>
    );
}
