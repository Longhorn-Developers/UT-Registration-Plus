/**
 * A fake background script for Storybook and the Storybook behavior tests.
 *
 * In the real extension, `background.someMessage(data)` (from `@shared/messages`) sends a message
 * through `chrome.runtime.sendMessage` and the background service worker answers it. Storybook has
 * no background script, so `chrome-mock.ts` routes those messages here instead.
 *
 * Stories opt in by registering a handler per message name, usually in `beforeEach`:
 *
 * ```ts
 * beforeEach: () => mockBackground({ validateLoginStatus: () => false }),
 * ```
 *
 * A message with no handler rejects, which is what happened before this mock existed (Storybook
 * had no `sendMessage` at all), so stories that don't register handlers behave exactly as before.
 */

// biome-ignore lint/suspicious/noExplicitAny: message payloads differ per message name
type BackgroundHandler = (data: any) => unknown;

const handlers = new Map<string, BackgroundHandler>();

/**
 * Registers handlers for background messages, keyed by message name.
 *
 * @returns A cleanup function that removes every handler, so it can be returned from `beforeEach`.
 */
export function mockBackground(overrides: Record<string, BackgroundHandler>): () => void {
    for (const [name, handler] of Object.entries(overrides)) {
        handlers.set(name, handler);
    }
    return resetBackgroundMock;
}

/** Removes every registered background handler. */
export function resetBackgroundMock(): void {
    handlers.clear();
}

/** Answers a message the way the background script would. Called by `chrome.runtime.sendMessage`. */
export async function handleBackgroundMessage(message: { name: string; data?: unknown }): Promise<unknown> {
    const handler = handlers.get(message.name);
    if (!handler) {
        throw new Error(`No Storybook mock registered for background message "${message.name}"`);
    }
    return handler(message.data);
}
