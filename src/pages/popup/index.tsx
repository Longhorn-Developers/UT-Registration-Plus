import 'uno.css';

import DialogProvider from '@views/components/common/DialogProvider/DialogProvider';
import ExtensionRoot from '@views/components/common/ExtensionRoot/ExtensionRoot';
import { MigrationDialog } from '@views/components/common/MigrationDialog';
import PopupMain from '@views/components/PopupMain';
import SentryProvider from '@views/contexts/SentryContext';
import React from 'react';
import { createRoot } from 'react-dom/client';

createRoot(document.getElementById('root')!).render(
    <SentryProvider fullInit>
        <ExtensionRoot>
            <DialogProvider>
                <MigrationDialog />
                <PopupMain />
            </DialogProvider>
        </ExtensionRoot>
    </SentryProvider>
);
