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
import React, { createContext, useContext, useMemo } from 'react';

/**
 * Context for the sentry provider.
 */
export const SentryContext = createContext<[scope: Scope, client: Client]>(undefined!);

/**
 * @returns The dialog context for showing dialogs.
 */
export const useSentryScope = () => useContext(SentryContext);

/**
 * SentryProvider component initializes and provides Sentry error tracking context to its children.
 * It ensures that Sentry is not initialized more than once and configures the Sentry client and scope.
 *
 * @param props - The properties object.
 * @param props.children - The child components that will have access to the Sentry context.
 * @param props.transactionName - Optional name for the Sentry transaction.
 * @param props.fullInit - Flag to determine if full initialization of Sentry should be performed.
 *
 * @returns The Sentry context provider wrapping the children components.
 */
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

    const providerValue = useMemo((): [scope: Scope, client: Client] => {
        if (parent) {
            const [parentScope, parentClient] = parent;

            const scope = parentScope.clone();
            if (transactionName) scope.setTransactionName(transactionName);

            return [scope, parentClient];
        }

        // filter integrations that use the global variable
        const integrations = getDefaultIntegrations({}).filter(
            defaultIntegration =>
                !['BrowserApiErrors', 'Breadcrumbs', 'GlobalHandlers'].includes(defaultIntegration.name)
        );

        const options: ClientOptions = {
            dsn: 'https://ed1a50d8626ff6be35b98d7b1ec86d9d@o4508033820852224.ingest.us.sentry.io/4508033822490624',
            integrations,
            transport: makeFetchTransport,
            stackParser: defaultStackParser,
            debug: import.meta.env.DEV,
            release: import.meta.env.VITE_PACKAGE_VERSION,
            environment: import.meta.env.VITE_SENTRY_ENVIRONMENT,
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
        return [scope, client];

        // This is on purpose to only run once
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <ErrorBoundary>
            <SentryContext.Provider value={providerValue}>{children}</SentryContext.Provider>
        </ErrorBoundary>
    );
}
