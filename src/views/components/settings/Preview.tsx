import clsx from 'clsx';
import type { PropsWithChildren } from 'react';
import React from 'react';

/**
 * Props for the Preview component.
 */
export interface PreviewProps {
    className?: string;
}

/**
 * Renders a preview component.
 *
 * @param props - The component props.
 * @returns The rendered preview component.
 */
export default function Preview(props: PropsWithChildren<PreviewProps>): JSX.Element {
    const { children } = props;
    return (
        <div className='w-1/2 inline-flex flex-col items-start justify-start rounded-xl bg-ut-gray/10'>
            <div className='m-4 inline-flex items-center self-stretch justify-end gap-2.5'>
                <div className='text-center text-sm text-ut-gray font-medium'>Preview</div>
            </div>
            <div className={clsx('h-full flex flex-col self-stretch justify-center p-5 space-y-4', props.className)}>
                {children}
            </div>
        </div>
    );
}
