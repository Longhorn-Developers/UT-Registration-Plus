import 'uno.css';

import renderRoot from '@shared/util/renderRoot';
import DialogProvider from '@views/components/common/DialogProvider/DialogProvider';
import ExtensionRoot from '@views/components/common/ExtensionRoot/ExtensionRoot';
import { MigrationDialog } from '@views/components/common/MigrationDialog';
import PopupMain from '@views/components/PopupMain';
import SentryProvider from '@views/contexts/SentryContext';

renderRoot(
    <SentryProvider fullInit>
        <ExtensionRoot>
            <DialogProvider>
                <MigrationDialog />
                <PopupMain />
            </DialogProvider>
        </ExtensionRoot>
    </SentryProvider>
);
