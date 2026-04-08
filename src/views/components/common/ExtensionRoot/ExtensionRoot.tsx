import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SentryProvider from '@views/contexts/SentryContext';
import type { Ref } from 'react';
import React from 'react';

import ShadowRootContainer from './ShadowRootContainer';

export { styleResetClass } from './ShadowRootContainer';

const queryClient = new QueryClient();
// import '@vitejs/devtools/client/inject';

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

export function ExtensionRootWrapper({
    ref,
    ...props
}: React.HTMLProps<HTMLDivElement> & {
    ref?: Ref<HTMLDivElement>;
}): React.JSX.Element {
    return <ShadowRootContainer {...props} ref={ref} />;
}
