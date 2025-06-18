import ExtensionRoot from '@views/components/common/ExtensionRoot/ExtensionRoot';
import ReportIssueMain from '@views/components/ReportIssueMain';
import SentryProvider from '@views/contexts/SentryContext';
import React from 'react';
import { createRoot } from 'react-dom/client';

createRoot(document.getElementById('root')!).render(
    <SentryProvider fullInit>
        <ExtensionRoot>
            <ReportIssueMain />
        </ExtensionRoot>
    </SentryProvider>
);
