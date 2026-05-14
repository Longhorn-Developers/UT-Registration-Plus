// biome-ignore assist/source/organizeImports: react-scan must be imported before React and React DOM
import { scan } from 'react-scan';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SentryProvider from '@views/contexts/SentryContext';
import React from 'react';

import ShadowRootContainer from './ShadowRootContainer';

export { styleResetClass } from './ShadowRootContainer';

const queryClient = new QueryClient();

if (import.meta.env.DEV)
    scan({
        showFPS: false,
    });

/**
 * A wrapper component for the extension elements that adds some basic styling to them
 */
export default function ExtensionRoot(props: React.HTMLProps<HTMLDivElement>): React.JSX.Element {
    return (
        <React.StrictMode>
            <SentryProvider>
                <QueryClientProvider client={queryClient}>
                    <ShadowRootContainer {...props} />
                </QueryClientProvider>
            </SentryProvider>
        </React.StrictMode>
    );
}

export const ExtensionRootWrapper = React.forwardRef<HTMLDivElement, React.HTMLProps<HTMLDivElement>>(
    ({ className, ...props }, ref) => <ShadowRootContainer {...props} className={className} ref={ref} />
);

ExtensionRootWrapper.displayName = 'ExtensionRootWrapper';
