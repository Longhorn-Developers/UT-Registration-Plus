import { captureFeedback } from '@sentry/react';
import { FEEDBACK_DATA_TYPES, requestDataCollectionPermissions } from '@shared/diagnosticReporting';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import ReportIssueMain from './ReportIssueMain';

vi.mock('@sentry/react', () => ({ captureFeedback: vi.fn() }));
vi.mock('@shared/diagnosticReporting', () => ({
    FEEDBACK_DATA_TYPES: ['personallyIdentifyingInfo'],
    requestDataCollectionPermissions: vi.fn(),
}));

let container: HTMLDivElement;
let root: Root;

beforeEach(async () => {
    vi.clearAllMocks();
    vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
    container = document.createElement('div');
    document.body.append(container);
    root = createRoot(container);
    await act(async () => root.render(<ReportIssueMain />));
    await act(async () => {
        const email = container.querySelector('input');
        const feedback = container.querySelector('textarea');
        if (!email || !feedback) throw new Error('Missing feedback form');
        Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set?.call(email, 'test@example.com');
        email.dispatchEvent(new Event('input', { bubbles: true }));
        Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')?.set?.call(feedback, 'Please fix this');
        feedback.dispatchEvent(new Event('input', { bubbles: true }));
    });
});
afterEach(async () => {
    await act(async () => root.unmount());
    container.remove();
    vi.unstubAllGlobals();
});

const submit = () =>
    act(async () => {
        const form = container.querySelector('form');
        if (!form) throw new Error('Missing feedback form');
        form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });

it('requests separate email consent and does not send when it is denied', async () => {
    vi.mocked(requestDataCollectionPermissions).mockResolvedValue(false);
    await submit();
    expect(requestDataCollectionPermissions).toHaveBeenCalledWith(FEEDBACK_DATA_TYPES);
    expect(captureFeedback).not.toHaveBeenCalled();
    expect(container.querySelector('[role="alert"]')?.textContent).toContain('permission to share your email');
    expect(container.textContent).not.toContain('Your feedback has been submitted');
});

it('submits the entered feedback after consent is granted', async () => {
    vi.mocked(requestDataCollectionPermissions).mockResolvedValue(true);
    await submit();
    expect(captureFeedback).toHaveBeenCalledWith(
        { message: 'Please fix this', email: 'test@example.com' },
        { includeReplay: false }
    );
    expect(container.textContent).toContain('Your feedback has been submitted');
});

it('keeps the form available if the permission request fails', async () => {
    vi.mocked(requestDataCollectionPermissions).mockRejectedValue(new Error('Unavailable'));
    await submit();
    expect(captureFeedback).not.toHaveBeenCalled();
    expect(container.querySelector('[role="alert"]')?.textContent).toContain('Please try again');
    expect(container.querySelector<HTMLButtonElement>('[type="submit"]')?.disabled).toBe(false);
});
