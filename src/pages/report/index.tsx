import renderRoot from '@shared/util/renderRoot';
import ReportIssueMain from '@views/components/ReportIssueMain';
import SentryProvider from '@views/contexts/SentryContext';

renderRoot(
    <SentryProvider fullInit>
        <ReportIssueMain />
    </SentryProvider>
);
