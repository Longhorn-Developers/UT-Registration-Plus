import CourseCatalogMain from '@views/components/CourseCatalogMain';
import InjectedButton from '@views/components/injected/AddAllButton';
import getSiteSupport, { SiteSupport } from '@views/lib/getSiteSupport';
import React from 'react';
import { createRoot } from 'react-dom/client';

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

if (support === SiteSupport.MY_UT) {
    const container = document.createElement('div');
    container.id = 'extension-root';

    const targetElement = document.getElementById('kgoui_Rcontent_I3_Rsecondary');
    targetElement?.appendChild(container);

    createRoot(container).render(
        <React.StrictMode>
            <InjectedButton />
        </React.StrictMode>
    );
}
