import type { PropsWithChildren } from 'react';

// claude-ed mocks for Sentry

type Integration = {
    name: string;
};

export class Scope {
    private client: BrowserClient | undefined;
    private transactionName: string | undefined;

    clone(): Scope {
        const nextScope = new Scope();
        nextScope.client = this.client;
        nextScope.transactionName = this.transactionName;
        return nextScope;
    }

    setClient(client: BrowserClient): void {
        this.client = client;
    }

    setTransactionName(transactionName: string): void {
        this.transactionName = transactionName;
    }
}

export class BrowserClient {
    constructor(_options?: unknown) {}

    init(): void {}
}

const currentScope = new Scope();

export const defaultStackParser = () => [];

export const ErrorBoundary = ({ children }: PropsWithChildren) => children;

export const getCurrentScope = () => currentScope;

export const getDefaultIntegrations = (): Integration[] => [
    // { name: 'BrowserApiErrors' },
    // { name: 'Breadcrumbs' },
    // { name: 'GlobalHandlers' },
    // { name: 'LinkedErrors' },
];

export const init = (_options?: unknown) => {
    const client = new BrowserClient(_options);
    currentScope.setClient(client);
    return client;
};

export const makeFetchTransport = () => ({ send: async () => ({}) });

export const captureFeedback = (..._args: unknown[]) => 'mock-event-id';

export const getTraceData = () => ({});

export const browserTracingIntegration = (_options?: unknown): Integration => ({ name: 'BrowserTracing' });
