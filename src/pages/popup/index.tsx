// import 'uno.css';

import { OptionsStore } from '@shared/storage/OptionsStore';
import { UserScheduleStore } from '@shared/storage/UserScheduleStore';
import renderRoot from '@shared/util/renderRoot';
import DialogProvider from '@views/components/common/DialogProvider/DialogProvider';
import ExtensionRoot from '@views/components/common/ExtensionRoot/ExtensionRoot';
import { MigrationDialog } from '@views/components/common/MigrationDialog';
import PopupMain from '@views/components/PopupMain';
import { Suspense } from 'react';
import { suspendUntilStoresReady } from 'src/lib/chrome-extension-toolkit/storage/createStore';

renderRoot(
    <ExtensionRoot>
        <DialogProvider>
            <MigrationDialog />
            <Suspense fallback={null}>
                <PopupBootstrap />
            </Suspense>
        </DialogProvider>
    </ExtensionRoot>
);

function PopupBootstrap() {
    suspendUntilStoresReady([UserScheduleStore, OptionsStore]);

    return <PopupMain />;
}
