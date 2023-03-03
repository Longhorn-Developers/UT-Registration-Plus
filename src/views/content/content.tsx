import React from 'react';
import { render } from 'react-dom';
import { ContextInvalidated, createShadowDOM, onContextInvalidated } from 'chrome-extension-toolkit';
import Main from './Main';


injectReact();


async function injectReact() {
    const shadowDom = createShadowDOM('ut-registration-plus-dom-container');
    render(<Main />, shadowDom.shadowRoot);
    await shadowDom.addStyle('static/css/content.css');
}

if (process.env.NODE_ENV === 'development') {
    onContextInvalidated(() => {
        const div = document.createElement('div');
        div.id = 'context-invalidated-container';
        document.body.appendChild(div);
        render(<ContextInvalidated color='black' backgroundColor='orange' />, div);
    });
}
