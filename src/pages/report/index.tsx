import ReportIssueMain from '@views/components/ReportIssueMain';
import SentryProvider from '@views/contexts/SentryContext';
import { createRoot } from 'react-dom/client';

// biome-ignore lint/style/noNonNullAssertion: This exists
createRoot(document.getElementById('root')!).render(
    <SentryProvider fullInit>
        <ReportIssueMain />
    </SentryProvider>
);
