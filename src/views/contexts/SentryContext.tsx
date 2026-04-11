import { isContentScript } from '@chrome-extension-toolkit';
import {
    BrowserClient,
    browserTracingIntegration,
    defaultStackParser,
    ErrorBoundary,
    getCurrentScope,
    getDefaultIntegrations,
    init,
    makeFetchTransport,
    Scope,
} from '@sentry/react';
import { useSentryToolbar } from '@sentry/toolbar';
import { SENTRY_OPTIONS } from '@shared/sentry';
import type React from 'react';
import { createContext, useContext, useMemo } from 'react';

// Integrations that attach global listeners or modify shared state, filtered per
// https://docs.sentry.io/platforms/javascript/best-practices/shared-environments/
const SHARED_ENV_FILTERED = new Set([
    'BrowserApiErrors',
    'BrowserSession',
    'Breadcrumbs',
    'ConversationId',
    'FunctionToString',
    'GlobalHandlers',
]);

const SentryContext = createContext<Scope | undefined>(undefined);

export const useSentryScope = () => useContext(SentryContext);

interface SentryProviderProps {
    children: React.ReactNode;
    transactionName?: string;
}

export default function SentryProvider({ children, transactionName }: SentryProviderProps): React.JSX.Element {
    const parentScope = useSentryScope();

    // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally only runs once
    const scope = useMemo(() => {
        if (parentScope) {
            const scope = parentScope.clone();
            if (transactionName) scope.setTransactionName(transactionName);
            return scope;
        }

        // Content scripts share the host page's environment — use an isolated client
        // to avoid polluting global Sentry state.
        if (isContentScript()) {
            const client = new BrowserClient({
                ...SENTRY_OPTIONS,
                integrations: getDefaultIntegrations({}).filter(i => !SHARED_ENV_FILTERED.has(i.name)),
                transport: makeFetchTransport,
                stackParser: defaultStackParser,
            });
            const scope = new Scope();
            scope.setClient(client);
            client.init();
            return scope;
        }

        // Standalone extension pages can safely use the global client with tracing.
        if (!init({ ...SENTRY_OPTIONS, integrations: [browserTracingIntegration()] }))
            throw new Error('Sentry failed to initialize');
        return getCurrentScope();
    }, []);

    if (import.meta.env.DEV) {
        // biome-ignore lint/correctness/useHookAtTopLevel: import.meta.env.DEV is a compile-time constant
        useSentryToolbar({
            enabled: !parentScope && !isContentScript(),
            cdn: chrome.runtime.getURL('sentry-toolbar.js'),
            initProps: {
                organizationSlug: 'longhorn-developers',
                projectIdOrSlug: 'ut-registration-plus',
            },
        });
    }

    return (
        <ErrorBoundary>
            <SentryContext.Provider value={scope}>{children}</SentryContext.Provider>
        </ErrorBoundary>
    );
}
