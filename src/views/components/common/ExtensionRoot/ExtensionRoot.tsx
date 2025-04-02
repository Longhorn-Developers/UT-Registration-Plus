// import '@unocss/reset/tailwind-compat.css';
import 'uno.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import clsx from 'clsx';
import React, { forwardRef } from 'react';

import styles from './ExtensionRoot.module.scss';

export const styleResetClass = styles.extensionRoot;

const queryClient = new QueryClient();

/**
 * A wrapper component for the extension elements that adds some basic styling to them
 */
export default function ExtensionRoot(props: React.HTMLProps<HTMLDivElement>): JSX.Element {
    const { className, ...others } = props;

    return (
        <React.StrictMode>
            <QueryClientProvider client={queryClient}>
                <div className={clsx(styleResetClass, 'h-full', className)} {...others} />
            </QueryClientProvider>
        </React.StrictMode>
    );
}

export const ExtensionRootWrapper = forwardRef<HTMLDivElement, React.HTMLProps<HTMLDivElement>>((props, ref) => (
    <div className={styleResetClass}>
        <div {...props} ref={ref} />
    </div>
));
