import type React from 'react';
import ReactDOM from 'react-dom/client';

/**
 * Renders a React element into a container.
 * @param element - The React element to render.
 * @param container - The container element where the React element will be rendered.
 * @throws Error if the container is null.
 */
export default function render(element: React.ReactElement, container: HTMLElement | ShadowRoot | null) {
    if (!container) {
        throw new Error('Container is null');
    }
    const root = ReactDOM.createRoot(container);
    root.render(element);
}
