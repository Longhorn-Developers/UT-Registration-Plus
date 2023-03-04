import React from 'react';
import { render } from 'react-dom';
import { ContextInvalidated, createShadowDOM, isExtensionPopup, onContextInvalidated } from 'chrome-extension-toolkit';
import CourseCatalogMain from './components/CourseCatalogMain';
import colors from './styles/colors.module.scss';
import getSiteSupport, { SiteSupport } from './lib/getSiteSupport';
import PopupMain from './components/PopupMain';

const support = getSiteSupport(window.location.href);

if (isExtensionPopup()) {
    render(<PopupMain />, document.getElementById('root'));
}

if (support.includes(SiteSupport.COURSE_CATALOG)) {
    const shadowDom = createShadowDOM('ut-registration-plus-dom-container');
    render(<CourseCatalogMain support={support} />, shadowDom.shadowRoot);
    shadowDom.addStyle('static/css/content.css');
}

if (support.includes(SiteSupport.WAITLIST)) {
    // TODO: Implement waitlist support
}

if (support.includes(SiteSupport.UT_PLANNER)) {
    // TODO: Implement ut planner support
}

onContextInvalidated(() => {
    const div = document.createElement('div');
    div.id = 'context-invalidated-container';
    document.body.appendChild(div);
    render(
        <ContextInvalidated fontFamily='monospace' color={colors.WHITE} backgroundColor={colors.BURNT_ORANGE} />,
        div
    );
});
