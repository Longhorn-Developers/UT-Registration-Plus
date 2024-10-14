import ReportIssueMain from '@views/components/ReportIssueMain';
import React from 'react';
import { createRoot } from 'react-dom/client';
import SentryProvider from 'src/views/contexts/SentryContext';

createRoot(document.getElementById('root')!).render(
    <SentryProvider fullInit>
        <ReportIssueMain />
    </SentryProvider>
);
