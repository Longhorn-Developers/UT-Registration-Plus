import React from 'react';
import { createRoot } from 'react-dom/client';
import CourseCatalogMain from '@views/components/CourseCatalogMain';
import getSiteSupport, { SiteSupport } from '@views/lib/getSiteSupport';

const support = getSiteSupport(window.location.href);

if (support === SiteSupport.COURSE_CATALOG_DETAILS || support === SiteSupport.COURSE_CATALOG_LIST) {
    const container = document.createElement('div');
    container.id = 'extension-root';
    document.body.appendChild(container);

    createRoot(container).render(
        <React.StrictMode>
            <CourseCatalogMain support={support} />
        </React.StrictMode>
    );
}
