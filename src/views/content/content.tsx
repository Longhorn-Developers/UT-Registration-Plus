import React from 'react';
import { render } from 'react-dom';
import { bMessenger } from 'src/shared/messages';
import { ContextInvalidated, createShadowDOM, onContextInvalidated } from 'chrome-extension-toolkit';
import { Button } from './components/Button/Button';

bMessenger.getTabId().then(tabId => {
    console.log('tabId', tabId);
});

injectReact();

async function injectReact() {
    const shadowDom = createShadowDOM('extension-dom-container');
    render(<Button />, shadowDom.shadowRoot);
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
