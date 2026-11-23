import { makeFetchTransport } from '@sentry/react';
import { hasDataCollectionPermissions, isDiagnosticReportingEnabled } from '@shared/diagnosticReporting';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { makeReportingTransport, SENTRY_OPTIONS } from './sentry';

const transport = vi.hoisted(() => ({ send: vi.fn(), flush: vi.fn() }));
vi.mock('@sentry/react', () => ({ makeFetchTransport: vi.fn(() => transport) }));
vi.mock('@shared/diagnosticReporting', () => ({
    FEEDBACK_DATA_TYPES: ['personallyIdentifyingInfo'],
    hasDataCollectionPermissions: vi.fn(),
    isDiagnosticReportingEnabled: vi.fn(),
}));
vi.mock('@shared/storage/ExtensionStore', () => ({ ExtensionStore: { get: async () => 'anonymous' } }));

type Envelope = Parameters<ReturnType<typeof makeReportingTransport>['send']>[0];
const envelope = (type: string): Envelope =>
    [{ event_id: 'event', sent_at: '2026-11-23T00:00:00Z' }, [[{ type }, {}]]] as Envelope;
const createTransport = () =>
    makeReportingTransport({ url: 'https://example.com/envelope', recordDroppedEvent: vi.fn() });

beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(isDiagnosticReportingEnabled).mockResolvedValue(true);
    vi.mocked(hasDataCollectionPermissions).mockResolvedValue(true);
    transport.send.mockResolvedValue({ statusCode: 200 });
    transport.flush.mockResolvedValue(true);
});
afterEach(() => vi.unstubAllGlobals());

describe('Sentry reporting transport', () => {
    it('is installed in the options shared by background and UI clients', () => {
        expect(SENTRY_OPTIONS.transport).toBe(makeReportingTransport);
    });

    it.each([
        'event',
        'transaction',
        'session',
        'client_report',
        'span',
        'log',
    ])('does not transmit %s items while reporting is disabled', async type => {
        vi.mocked(isDiagnosticReportingEnabled).mockResolvedValue(false);
        await createTransport().send(envelope(type));
        expect(transport.send).not.toHaveBeenCalled();
    });

    it('sends nothing while the initial preference check is pending', async () => {
        let resolve: (enabled: boolean) => void = () => {};
        vi.mocked(isDiagnosticReportingEnabled).mockReturnValue(
            new Promise(done => {
                resolve = done;
            })
        );
        const pending = createTransport().send(envelope('event'));
        expect(transport.send).not.toHaveBeenCalled();
        resolve(false);
        await pending;
        expect(transport.send).not.toHaveBeenCalled();
    });

    it('uses the latest choice for each send without recreating clients', async () => {
        const clientTransport = createTransport();
        const event = envelope('event');
        await clientTransport.send(event);
        expect(transport.send).toHaveBeenLastCalledWith(event);
        vi.mocked(isDiagnosticReportingEnabled).mockResolvedValue(false);
        await clientTransport.send(envelope('transaction'));
        expect(transport.send).toHaveBeenCalledOnce();
    });

    it('sends only the submitted feedback when automatic reporting is off', async () => {
        vi.mocked(isDiagnosticReportingEnabled).mockResolvedValue(false);
        const feedback = envelope('feedback');
        feedback[0].trace = { trace_id: 'private-trace' };
        const item = feedback[1][0];
        if (!item) throw new Error('Missing feedback item');
        item[1] = {
            event_id: 'feedback',
            timestamp: 123,
            request: { url: 'https://example.com/private-page' },
            breadcrumbs: [{ message: 'automatic diagnostic' }],
            contexts: { feedback: { message: 'Please fix this', contact_email: 'test@example.com', url: 'private' } },
        };
        // A mixed envelope must not smuggle automatic events alongside feedback.
        (feedback[1] as Array<Envelope[1][number]>).push(...envelope('transaction')[1]);
        await createTransport().send(feedback);
        const sent = transport.send.mock.calls[0]?.[0] as Envelope;
        expect(sent[0]).not.toHaveProperty('trace');
        expect(sent[1]).toEqual([
            [
                { type: 'feedback' },
                {
                    type: 'feedback',
                    event_id: 'feedback',
                    timestamp: 123,
                    contexts: { feedback: { message: 'Please fix this', contact_email: 'test@example.com' } },
                },
            ],
        ]);
    });

    it('blocks feedback without its own permission even when diagnostics are enabled', async () => {
        vi.mocked(hasDataCollectionPermissions).mockResolvedValue(false);
        await createTransport().send(envelope('feedback'));
        expect(transport.send).not.toHaveBeenCalled();
    });

    it('delegates flushing to the underlying transport', async () => {
        expect(await createTransport().flush(100)).toBe(true);
        expect(transport.flush).toHaveBeenCalledWith(expect.any(Number));
        expect(transport.flush.mock.calls[0]?.[0]).toBeLessThanOrEqual(100);
        expect(makeFetchTransport).toHaveBeenCalledOnce();
    });

    it('waits for pending consent checks when flushing', async () => {
        let resolve: (enabled: boolean) => void = () => {};
        vi.mocked(isDiagnosticReportingEnabled).mockReturnValue(
            new Promise(done => {
                resolve = done;
            })
        );
        const clientTransport = createTransport();
        const pending = clientTransport.send(envelope('event'));
        const flushing = clientTransport.flush(1000);
        expect(transport.flush).not.toHaveBeenCalled();
        resolve(true);
        await pending;
        expect(await flushing).toBe(true);
        expect(transport.send).toHaveBeenCalledOnce();
    });

    it('honors the flush timeout if a consent check stalls', async () => {
        vi.mocked(isDiagnosticReportingEnabled).mockReturnValue(new Promise(() => {}));
        const clientTransport = createTransport();
        void clientTransport.send(envelope('event'));
        expect(await clientTransport.flush(1)).toBe(false);
        expect(transport.send).not.toHaveBeenCalled();
    });
});
