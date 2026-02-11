/**
 * An extension of HTMLDivElement that represents a shadow root for use within an Extension Content Script.
 */
interface HTMLShadowDOMElement extends HTMLDivElement {
    shadowRoot: ShadowRoot & {
        INJECTION_POINT: HTMLDivElement;
    };
    /**
     * Adds a style sheet to the shadow root.
     * @param path the path to the style sheet relative to the extension's root directory. uses chrome.runtime.getURL to get the absolute path.
     */
    addStyle(path: string): Promise<void>;
}

/**
 * In extension content scripts, often times the parent site's styles will override the styles of the extension.
 * To get around this, we create a shadow DOM and isolate the extension's html and styles in the shadow DOM.
 * from the parent site's styles to prevent conflicts.
 * @param id the id of the shadow root.
 * @param options the optional options for the shadow root.
 * @param isolate whether or not to isolate the extension's document flow from the parent site's document flow.
 * @returns A Div that represents the shadow root with some additional methods added to it.
 */
export function createShadowDOM(id: string, options?: ShadowRootInit, isolate = false): HTMLShadowDOMElement {
    const html = document.querySelector('html');
    if (!html) {
        throw new Error('Could not find html element');
    }
    const div = document.createElement('div') as HTMLShadowDOMElement;
    div.id = id;
    div.style.all = 'initial';
    div.attachShadow({
        mode: 'open',
        ...(options || {}),
    });

    const INJECTION_POINT = document.createElement('div');
    INJECTION_POINT.id = 'INJECTION_POINT';
    div.shadowRoot.appendChild(INJECTION_POINT);
    div.shadowRoot.INJECTION_POINT = INJECTION_POINT;

    div.addStyle = async (path: string) => {
        const style = await fetch(chrome.runtime.getURL(path));
        const styleNode = document.createElement('style');
        const parsedStyle = await style.text();
        styleNode.textContent = parsedStyle;
        div.shadowRoot.appendChild(styleNode);
    };

    html.appendChild(div);

    if (isolate) document.body.style.isolation = 'isolate';

    return div as HTMLShadowDOMElement;
}
