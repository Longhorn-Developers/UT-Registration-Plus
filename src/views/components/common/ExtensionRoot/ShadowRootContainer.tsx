/**
 * Shadow DOM container for style-isolated extension UI.
 *
 * Renders children inside a shadow root so that injected components are shielded from
 * host-page styles. UnoCSS utilities and the extension's own SCSS are injected once per
 * shadow root and deduplicated across mounts. Child components can register additional
 * stylesheets at runtime via the {@link useShadowStyles} hook.
 */

import unoInlineStyles from 'virtual:uno.css?inline';
import type { Ref } from 'react';
import React from 'react';
import { createPortal } from 'react-dom';
import unoStyle from 'unocss-inline/style';

import styles from './ExtensionRoot.module.scss';
import extensionRootStyles from './ExtensionRoot.module.scss?inline';

/** CSS module class that applies the extension's base font, color, and scrollbar resets. */
export const styleResetClass = styles.extensionRoot;

const shadowRootStyles = import.meta.hot ? `${unoInlineStyles}\n${extensionRootStyles}` : `${extensionRootStyles}`;
const styledShadowRoots = new WeakSet<ShadowRoot>();
const shadowRootInjectedStyles = new WeakMap<ShadowRoot, Set<string>>();
const ShadowStyleContext = React.createContext<((styles: readonly string[]) => void) | null>(null);

function assignRef<T>(ref: Ref<T> | undefined, value: T | null) {
    if (typeof ref === 'function') {
        ref(value);
        return;
    }

    if (ref) {
        ref.current = value;
    }
}

/** Injects the base UnoCSS + extension styles into a shadow root exactly once. */
function ensureShadowStyles(shadowRoot: ShadowRoot) {
    if (styledShadowRoots.has(shadowRoot)) {
        return;
    }

    const style = document.createElement('style');
    style.textContent = shadowRootStyles;
    if (!import.meta.hot) {
        // unocss-inline only works on non-hot mode, while "virtual:uno.css?inline" only works on hot mode ._.
        shadowRoot.appendChild(unoStyle.cloneNode(true));
    }
    shadowRoot.appendChild(style);
    styledShadowRoots.add(shadowRoot);
}

/** Appends additional style text to a shadow root, deduplicating by content. */
function appendShadowStyles(shadowRoot: ShadowRoot, styleTexts: readonly string[]) {
    let injectedStyles = shadowRootInjectedStyles.get(shadowRoot);
    if (!injectedStyles) {
        injectedStyles = new Set<string>();
        shadowRootInjectedStyles.set(shadowRoot, injectedStyles);
    }

    for (const styleText of styleTexts) {
        if (!styleText || injectedStyles.has(styleText)) {
            continue;
        }

        const style = document.createElement('style');
        style.textContent = styleText;
        shadowRoot.append(style);
        injectedStyles.add(styleText);
    }
}

/**
 * Registers a CSS string into the nearest shadow root.
 * Styles are deduplicated — the same text will only be injected once per root.
 */
export function useShadowStyles(styleToRegister: string) {
    const registerStyles = React.useContext(ShadowStyleContext);

    React.useInsertionEffect(() => {
        if (!registerStyles || !styleToRegister) return;
        registerStyles([styleToRegister]);
    }, [registerStyles, styleToRegister]);
}

/**
 * Renders a `<div>` host element with an attached open shadow root.
 * Children are portalled into the shadow root and wrapped with {@link styleResetClass}
 * for base styling. Additional styles can be registered from descendants via {@link useShadowStyles}.
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
    const shadowRootRef = React.useRef<ShadowRoot | null>(null);

    const setHostRef = React.useCallback(
        (node: HTMLDivElement | null) => {
            assignRef(ref, node);

            if (!node) {
                shadowRootRef.current = null;
                setShadowRoot(null);
                return;
            }

            const root = node.shadowRoot ?? node.attachShadow({ mode: 'open' });
            ensureShadowStyles(root);
            shadowRootRef.current = root;
            setShadowRoot(root);
        },
        [ref]
    );

    const registerStyles = React.useCallback((styleTexts: readonly string[]) => {
        const root = shadowRootRef.current;
        if (!root) {
            return;
        }

        appendShadowStyles(root, styleTexts);
    }, []);

    return (
        <ShadowStyleContext.Provider value={registerStyles}>
            <div className={className} {...props} ref={setHostRef}>
                {shadowRoot && createPortal(<div className={styleResetClass}>{children}</div>, shadowRoot)}
            </div>
        </ShadowStyleContext.Provider>
    );
}
