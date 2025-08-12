import CourseCatalogMain from '@views/components/CourseCatalogMain';
import InjectedButton from '@views/components/injected/AddAllButton';
import DaysCheckbox from '@views/components/injected/DaysCheckbox';
import ShadedResults from '@views/components/injected/SearchResultShader';
import getSiteSupport, { SiteSupport } from '@views/lib/getSiteSupport';
import React from 'react';
import { createRoot } from 'react-dom/client';

const support = getSiteSupport(window.location.href);

const renderComponent = (Component: React.ComponentType) => {
    const container = document.createElement('div');
    container.id = 'extension-root';
    document.body.appendChild(container);

    createRoot(container).render(
        <React.StrictMode>
            <Component />
        </React.StrictMode>
    );
};

if (support === SiteSupport.COURSE_CATALOG_DETAILS || support === SiteSupport.COURSE_CATALOG_LIST) {
    renderComponent(() => <CourseCatalogMain support={support} />);
}

if (support === SiteSupport.MY_UT) {
    renderComponent(InjectedButton);
}

if (support === SiteSupport.COURSE_CATALOG_SEARCH) {
    renderComponent(DaysCheckbox);
}

if (support === SiteSupport.COURSE_CATALOG_KWS) {
    renderComponent(ShadedResults);
}
