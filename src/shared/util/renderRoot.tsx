import type { ReactNode } from 'react';
import { createRoot } from 'react-dom/client';

/**
 * Creates or reuses a React root on the given container element.
 * Prevents the "createRoot() on a container that has already been passed to createRoot()" warning
 * when HMR re-executes the entry module in dev mode.
 */
export default function renderRoot(element: ReactNode) {
    const container = document.getElementById('root');
    if (!container) throw new Error('Root element not found');
    const el = container as HTMLElement & { __reactRoot?: ReturnType<typeof createRoot> };
    const root = el.__reactRoot ?? createRoot(el);
    el.__reactRoot = root;
    root.render(element);
}
