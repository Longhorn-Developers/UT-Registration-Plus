import ReportIssueMain from '@views/components/ReportIssueMain';
import { useDialog } from '@views/contexts/DialogContext';
import React from 'react';

/**
 * Opens the feedback form in a centered in-page dialog.
 */
export default function useReportIssueDialog(): () => void {
    const showDialog = useDialog();

    return () => {
        showDialog(
            close => ({
                className: 'max-h-none border-none bg-transparent p-0 shadow-none overflow-hidden',
                description: <ReportIssueMain onClose={close} />,
                buttons: <span />,
            }),
            {
                closeOnClickOutside: true,
            }
        );
    };
}
