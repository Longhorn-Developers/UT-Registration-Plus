import React from 'react';
import { render } from 'react-dom';
import { ContextInvalidated, createShadowDOM, isExtensionPopup, onContextInvalidated } from 'chrome-extension-toolkit';
import CourseCatalogMain from './components/CourseCatalogMain';
import colors from './styles/colors.module.scss';
import getSiteSupport, { SiteSupport } from './lib/getSiteSupport';
import PopupMain from './components/PopupMain';

const support = getSiteSupport(window.location.href);
if (!support) {
    throw new Error('UT Registration Plus does not support this page, even though it should...');
}

if (isExtensionPopup()) {
    render(<PopupMain />, document.getElementById('root'));
}

if (support === SiteSupport.COURSE_CATALOG_DETAILS || support === SiteSupport.COURSE_CATALOG_LIST) {
    const shadowDom = createShadowDOM('ut-registration-plus-container');
    render(<CourseCatalogMain support={support} />, shadowDom.shadowRoot);
    shadowDom.addStyle('static/css/content.css');
}

if (support === SiteSupport.WAITLIST) {
    // TODO: Implement waitlist support
}

if (support === SiteSupport.UT_PLANNER) {
    // TODO: Implement ut planner support
}

onContextInvalidated(() => {
    const div = document.createElement('div');
    div.id = 'context-invalidated-container';
    document.body.appendChild(div);
    render(
        <ContextInvalidated fontFamily='monospace' color={colors.white} backgroundColor={colors.burnt_orange} />,
        div
    );
});
