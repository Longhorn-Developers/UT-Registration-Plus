import 'uno.css';

import DialogProvider from '@views/components/common/DialogProvider/DialogProvider';
import ExtensionRoot from '@views/components/common/ExtensionRoot/ExtensionRoot';
import { MigrationDialog } from '@views/components/common/MigrationDialog';
import PopupMain from '@views/components/PopupMain';
import SentryProvider from '@views/contexts/SentryContext';
import { useInteractionStatsCollecting } from '@views/hooks/useInteractionStatsCollecting';
import React from 'react';
import { createRoot } from 'react-dom/client';

const Popup = () => {
    useInteractionStatsCollecting();

    return (
        <SentryProvider fullInit>
            <ExtensionRoot>
                <DialogProvider>
                    <MigrationDialog />
                    <PopupMain />
                </DialogProvider>
            </ExtensionRoot>
        </SentryProvider>
    );
};

createRoot(document.getElementById('root')!).render(<Popup />);
