import { fireEvent, waitFor, within } from 'storybook/test';

/**
 * Helpers for finding elements in behavior tests.
 *
 * Extension UI renders inside shadow roots (see `ShadowRootContainer`), and Testing Library's
 * queries stop at a shadow root's edge. These helpers run a normal Testing Library query against
 * the page and every open shadow root inside it, so tests can still find things the way a user
 * would: by role and accessible name, not by DOM structure.
 */

type Queries = ReturnType<typeof within>;

/** The given root plus every open shadow root nested anywhere inside it. */
function allRoots(root: ParentNode): ParentNode[] {
    const roots: ParentNode[] = [root];
    for (const el of root.querySelectorAll('*')) {
        if (el.shadowRoot) {
            roots.push(...allRoots(el.shadowRoot));
        }
    }
    return roots;
}

/**
 * Runs `query` against `container` and all shadow roots inside it, returning the first match.
 * Returns `null` if nothing matches. Use `query*` Testing Library queries inside it.
 *
 * @example
 * ```ts
 * queryInShadow(document.body, q => q.queryByRole('link', { name: 'Log in' }));
 * ```
 */
export function queryInShadow<T extends HTMLElement>(
    container: ParentNode,
    query: (queries: Queries) => T | null
): T | null {
    for (const root of allRoots(container)) {
        // Testing Library only needs querySelectorAll, which ShadowRoot has
        const match = query(within(root as HTMLElement));
        if (match) return match;
    }
    return null;
}

/**
 * Like {@link queryInShadow}, but waits (Testing Library's default timeout) until a match appears,
 * and fails the test with `description` if it never does.
 *
 * @example
 * ```ts
 * const button = await findInShadow(document.body, q => q.queryByRole('button', { name: 'Quick Add' }), 'Quick Add button');
 * ```
 */
export async function findInShadow<T extends HTMLElement>(
    container: ParentNode,
    query: (queries: Queries) => T | null,
    description: string
): Promise<T> {
    return waitFor(() => {
        const match = queryInShadow(container, query);
        if (!match) throw new Error(`Could not find ${description}`);
        return match;
    });
}

/**
 * Types `text` into an input that lives inside a shadow root, one character at a time.
 *
 * `userEvent.type` doesn't work there: the input's text changes, but React's `onChange` never fires.
 * (Most likely because user-event tracks focus at the document level, where focus inside a shadow
 * root shows up on the host element instead of the input.) This sets each value the way Testing
 * Library's `fireEvent.change` does, which React does notice. Real users typing are not affected.
 */
export function typeInShadow(input: HTMLInputElement, text: string): void {
    for (const char of text) {
        fireEvent.change(input, { target: { value: input.value + char } });
    }
}
