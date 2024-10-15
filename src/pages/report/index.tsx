import ReportIssueMain from '@views/components/ReportIssueMain';
import SentryProvider from '@views/contexts/SentryContext';
import React from 'react';
import { createRoot } from 'react-dom/client';

createRoot(document.getElementById('root')!).render(
    <SentryProvider fullInit>
        <ReportIssueMain />
    </SentryProvider>
);
