import { OptionsStore } from '@shared/storage/OptionsStore';
import { UserScheduleStore } from '@shared/storage/UserScheduleStore';
import CourseCatalogMain from '@views/components/CourseCatalogMain';
import InjectedButton from '@views/components/injected/AddAllButton';
import DaysCheckbox from '@views/components/injected/DaysCheckbox';
import ShadedResults from '@views/components/injected/SearchResultShader';
import getSiteSupport, { SiteSupport } from '@views/lib/getSiteSupport';
import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { suspendUntilStoresReady } from 'src/lib/chrome-extension-toolkit/storage/createStore';

const support = getSiteSupport(window.location.href);

const renderComponent = (Component: React.ComponentType) => {
    const container = document.createElement('div');
    container.id = 'extension-root';
    document.body.appendChild(container);

    createRoot(container).render(
        <React.StrictMode>
            <Suspense fallback={null}>
                <Component />
            </Suspense>
        </React.StrictMode>
    );
};

function AddAllButtonBootstrap() {
    suspendUntilStoresReady([UserScheduleStore]);

    return <InjectedButton />;
}

if (support === SiteSupport.COURSE_CATALOG_DETAILS || support === SiteSupport.COURSE_CATALOG_LIST) {
    renderComponent(() => {
        suspendUntilStoresReady([UserScheduleStore, OptionsStore]);

        return <CourseCatalogMain support={support} />;
    });
}

if (support === SiteSupport.MY_UT) {
    renderComponent(AddAllButtonBootstrap);
}

if (support === SiteSupport.COURSE_CATALOG_SEARCH) {
    renderComponent(DaysCheckbox);
}

if (support === SiteSupport.COURSE_CATALOG_KWS) {
    renderComponent(ShadedResults);
}
