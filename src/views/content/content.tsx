import React from 'react';
import { render } from 'react-dom';
import { ContextInvalidated, createShadowDOM, onContextInvalidated } from 'chrome-extension-toolkit';
import ContentMain from './ContentMain';
import colors from '../styles/colors.module.scss';
import getPageTypes, { PageType } from './lib/getPageTypes';
import { populateSearchInputs } from './lib/courseSchedule/populateSearchInputs';

const pageTypes = getPageTypes(window.location.href);
console.log('pageTypes:', pageTypes);

if (pageTypes.includes(PageType.COURSE_SCHEDULE)) {
    if (pageTypes.includes(PageType.COURSE_SCHEDULE_LIST)) {
        populateSearchInputs();
    }
    const shadowDom = createShadowDOM('ut-registration-plus-dom-container');
    render(<ContentMain />, shadowDom.shadowRoot);
    shadowDom.addStyle('static/css/content.css');
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
