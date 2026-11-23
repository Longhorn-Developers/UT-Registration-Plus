import type { ErrorEvent } from '@sentry/react';
import { makeFetchTransport } from '@sentry/react';
import {
    FEEDBACK_DATA_TYPES,
    hasDataCollectionPermissions,
    isDiagnosticReportingEnabled,
} from '@shared/diagnosticReporting';
import { ExtensionStore } from '@shared/storage/ExtensionStore';

type Envelope = Parameters<ReturnType<typeof makeFetchTransport>['send']>[0];
type FeedbackItem = Extract<Envelope[1][number], [{ type: 'feedback' }, unknown]>;

let anonymousId: string | undefined;
ExtensionStore.get('anonymousId').then(id => {
    anonymousId = id;
});

export const makeReportingTransport: typeof makeFetchTransport = options => {
    const transport = makeFetchTransport(options);

    const pendingSends = new Set<Promise<unknown>>();
    const send = async (envelope: Envelope) => {
        const hasFeedback = envelope[1].some(([header]) => header.type === 'feedback');
        const [reportingEnabled, feedbackAllowed] = await Promise.all([
            isDiagnosticReportingEnabled(),
            hasFeedback ? hasDataCollectionPermissions(FEEDBACK_DATA_TYPES) : false,
        ]);
        const items: Array<Envelope[1][number]> = [];

        for (const item of envelope[1]) {
            if (item[0].type === 'feedback') {
                if (!feedbackAllowed) continue;
                const event = (item as FeedbackItem)[1];
                // A manual feedback submission must not include automatic diagnostics.
                items.push([
                    item[0],
                    {
                        type: 'feedback',
                        event_id: event.event_id,
                        timestamp: event.timestamp ?? Date.now() / 1000,
                        contexts: {
                            feedback: {
                                message: event.contexts?.feedback?.message,
                                contact_email: event.contexts?.feedback?.contact_email,
                            },
                        },
                    },
                ]);
            } else if (reportingEnabled) {
                items.push(item);
            }
        }

        if (!items.length) return {};
        const headers = { ...envelope[0] };
        if (!reportingEnabled) delete headers.trace;
        // Filtering preserves each item's shape, but Sentry's envelope union cannot infer that.
        return transport.send([headers, items] as Envelope);
    };

    return {
        send(envelope) {
            const request = send(envelope);
            pendingSends.add(request);
            void request.then(
                () => pendingSends.delete(request),
                () => pendingSends.delete(request)
            );
            return request;
        },
        async flush(timeout) {
            const started = Date.now();
            let timer: ReturnType<typeof setTimeout> | undefined;
            try {
                const drained = Promise.allSettled([...pendingSends]).then(() => true);
                const completed = timeout
                    ? await Promise.race([
                          drained,
                          new Promise<boolean>(resolve => {
                              timer = setTimeout(() => resolve(false), timeout);
                          }),
                      ])
                    : await drained;
                if (!completed) return false;
                return transport.flush(timeout ? Math.max(1, timeout - (Date.now() - started)) : timeout);
            } finally {
                clearTimeout(timer);
            }
        },
    };
};

export const SENTRY_OPTIONS = {
    dsn: 'https://ed1a50d8626ff6be35b98d7b1ec86d9d@o4508033820852224.ingest.us.sentry.io/4508033822490624',
    skipBrowserExtensionCheck: true,
    transport: makeReportingTransport,
    tracesSampleRate: import.meta.env.DEV ? 1.0 : 0.2,
    debug: false,
    release: import.meta.env.VITE_PACKAGE_VERSION,
    environment: import.meta.env.VITE_SENTRY_ENVIRONMENT,
    beforeSend(event: ErrorEvent) {
        if (anonymousId) {
            event.user = { ...event.user, id: anonymousId };
        }
        return event;
    },
};
