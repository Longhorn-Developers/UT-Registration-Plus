import getSiteSupport, { SiteSupport } from '@src/views/lib/getSiteSupport';
import React from 'react';
import { createRoot } from 'react-dom/client';

const support = getSiteSupport(window.location.href);

async function handleInjection() {
    if (support === SiteSupport.COURSE_CATALOG_DETAILS || support === SiteSupport.COURSE_CATALOG_LIST) {
        const container = document.createElement('div');
        container.id = 'extension-root';
        document.body.appendChild(container);
        // const shadowDom = createShadowDOM('ut-registration-plus-container');
        // shadowDom.addStyle('static/css/content.css');

        if (process.env.NODE_ENV === 'development') {
            // @ts-expect-error this is a url / path
            // eslint-disable-next-line import/no-absolute-path, import/extensions
            const RefreshRuntime = (await import('/@react-refresh')).default;
            RefreshRuntime.injectIntoGlobalHook(window);
            (window as any).$RefreshReg$ = () => {};
            (window as any).$RefreshSig$ = () => type => type;
            // eslint-disable-next-line no-underscore-dangle
            (window as any).__vite_plugin_react_preamble_installed__ = true;
        }

        const CourseCatalogMain = (await import('@src/views/components/CourseCatalogMain')).default;

        createRoot(container).render(<CourseCatalogMain support={support} />);
    }
}

handleInjection();
