import { ContextInvalidated, createShadowDOM, onContextInvalidated } from 'chrome-extension-toolkit';
import React from 'react';

import CourseCatalogMain from './components/CourseCatalogMain';
import PopupMain from './components/PopupMain';
import getSiteSupport, { SiteSupport } from './lib/getSiteSupport';
import render from './lib/react';

const support = getSiteSupport(window.location.href);
console.log('support:', support);

if (!support) {
    throw new Error('UT Registration Plus does not support this page, even though it should...');
}

// if we are in an iframe, throw an error
if (window.self !== window.top) {
    throw new Error('inside an iframe');
}

if (support === SiteSupport.EXTENSION_POPUP) {
    render(<PopupMain />, document.getElementById('root'));
}

if (support === SiteSupport.MY_CALENDAR) {
    render(<div>My Calendar</div>, document.getElementById('root'));
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

    render(<ContextInvalidated className='bg-ut-burntorange text-white font-mono' />, div);
});
