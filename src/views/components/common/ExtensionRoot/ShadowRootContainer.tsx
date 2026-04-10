/**
 * Shadow DOM container for style-isolated extension UI.
 *
 * Renders children inside a shadow root so that injected components are shielded from
 * host-page styles. The vite-inline-styles plugin wraps Vite's `updateStyle`/`removeStyle`
 * to feed all processed CSS into a shared `CSSStyleSheet`, which is adopted once per shadow root.
 */

import 'virtual:uno.css';
import globalStyleSheet from 'virtual:inline-styles';
import type { Ref } from 'react';
import React from 'react';
import { createPortal } from 'react-dom';

import styles from './ExtensionRoot.module.scss';

/** CSS module class that applies the extension's base font, color, and scrollbar resets. */
export const styleResetClass = styles.extensionRoot;

const styledShadowRoots = new WeakSet<ShadowRoot>();

function assignRef<T>(ref: Ref<T> | undefined, value: T | null) {
    if (typeof ref === 'function') {
        ref(value);
        return;
    }

    if (ref) {
        ref.current = value;
    }
}

/** Adopts the global CSSStyleSheet into a shadow root exactly once. */
function ensureShadowStyles(shadowRoot: ShadowRoot) {
    if (styledShadowRoots.has(shadowRoot)) {
        return;
    }

    shadowRoot.adoptedStyleSheets = [globalStyleSheet];
    styledShadowRoots.add(shadowRoot);
}

/**
 * Renders a `<div>` host element with an attached open shadow root.
 * Children are portalled into the shadow root and wrapped with {@link styleResetClass}
 * for base styling.
 */
export default function ShadowRootContainer({
    ref,
    className,
    children,
    ...props
}: React.HTMLProps<HTMLDivElement> & {
    ref?: Ref<HTMLDivElement>;
}): React.JSX.Element {
    const [shadowRoot, setShadowRoot] = React.useState<ShadowRoot | null>(null);

    const setHostRef = React.useCallback(
        (node: HTMLDivElement | null) => {
            assignRef(ref, node);

            if (!node) {
                setShadowRoot(null);
                return;
            }

            const root = node.shadowRoot ?? node.attachShadow({ mode: 'open' });
            ensureShadowStyles(root);
            setShadowRoot(root);
        },
        [ref]
    );

    return (
        <div className={className} {...props} ref={setHostRef}>
            {shadowRoot && createPortal(<div className={styleResetClass}>{children}</div>, shadowRoot)}
        </div>
    );
}
