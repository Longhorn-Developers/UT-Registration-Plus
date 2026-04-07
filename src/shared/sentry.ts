import type { ErrorEvent } from '@sentry/react';
import { ExtensionStore } from '@shared/storage/ExtensionStore';

let anonymousId: string | undefined;
ExtensionStore.get('anonymousId').then(id => {
    anonymousId = id;
});

export const SENTRY_OPTIONS = {
    dsn: 'https://ed1a50d8626ff6be35b98d7b1ec86d9d@o4508033820852224.ingest.us.sentry.io/4508033822490624',
    skipBrowserExtensionCheck: true,
    tracesSampleRate: import.meta.env.DEV ? 1.0 : 0.2,
    debug: import.meta.env.DEV,
    release: import.meta.env.VITE_PACKAGE_VERSION,
    environment: import.meta.env.VITE_SENTRY_ENVIRONMENT,
    beforeSend(event: ErrorEvent) {
        if (anonymousId) {
            event.user = { ...event.user, id: anonymousId };
        }
        return event;
    },
};
