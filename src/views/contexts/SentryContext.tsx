import {
    BrowserClient,
    defaultStackParser,
    ErrorBoundary,
    getCurrentScope,
    getDefaultIntegrations,
    init,
    makeFetchTransport,
    Scope,
} from '@sentry/react';
import type { Client, ClientOptions } from '@sentry/types';
import React, { createContext, useContext } from 'react';

/**
 * Context for the sentry provider.
 */
export const SentryContext = createContext<[scope: Scope, client: Client]>(undefined!);

/**
 * @returns The dialog context for showing dialogs.
 */
export const useSentryScope = () => useContext(SentryContext);

export default function SentryProvider({
    children,
    transactionName,
    fullInit,
}: {
    children: React.ReactNode;
    transactionName?: string;
    fullInit?: boolean;
}): JSX.Element {
    // prevent accidentally initializing sentry twice
    const parent = useSentryScope();
    if (parent) {
        const [parentScope, parentClient] = parent;

        const scope = parentScope.clone();
        if (transactionName) scope.setTransactionName(transactionName);

        return <SentryContext.Provider value={[scope, parentClient]}>{children}</SentryContext.Provider>;
    }

    // filter integrations that use the global variable
    const integrations = getDefaultIntegrations({}).filter(defaultIntegration => {
        return !['BrowserApiErrors', 'Breadcrumbs', 'GlobalHandlers'].includes(defaultIntegration.name);
    });

    const options: ClientOptions = {
        dsn: 'https://ed1a50d8626ff6be35b98d7b1ec86d9d@o4508033820852224.ingest.us.sentry.io/4508033822490624',
        integrations,
        transport: makeFetchTransport,
        stackParser: defaultStackParser,
        // debug: true,
        release: import.meta.env.VITE_PACKAGE_VERSION,
    };

    let client: Client;
    let scope: Scope;

    if (fullInit) {
        client = init(options)!;
        scope = getCurrentScope();
    } else {
        client = new BrowserClient(options);

        scope = new Scope();

        scope.setClient(client);
        client.init();
    }

    return (
        <ErrorBoundary>
            <SentryContext.Provider value={[scope, client]}>{children}</SentryContext.Provider>
        </ErrorBoundary>
    );
}
