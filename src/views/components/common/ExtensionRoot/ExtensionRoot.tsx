import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { Ref } from 'react';
import React from 'react';

import ShadowRootContainer from './ShadowRootContainer';

export { styleResetClass, useShadowStyles } from './ShadowRootContainer';

const queryClient = new QueryClient();

/**
 * A wrapper component for the extension elements that adds some basic styling to them
 */
export default function ExtensionRoot(props: React.HTMLProps<HTMLDivElement>): React.JSX.Element {
    return (
        <React.StrictMode>
            <QueryClientProvider client={queryClient}>
                <ShadowRootContainer {...props} />
            </QueryClientProvider>
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
