import React from 'react';
import ReactDOM from 'react-dom/client';

export default function render(element: React.ReactElement, container: HTMLElement | ShadowRoot | null) {
    if (!container) {
        throw new Error('Container is null');
    }
    const root = ReactDOM.createRoot(container);
    root.render(element);
}
