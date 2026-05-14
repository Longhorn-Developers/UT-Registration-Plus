import { UserScheduleStore } from '@shared/storage/UserScheduleStore';
import DialogProvider from '@views/components/common/DialogProvider/DialogProvider';
import ExtensionRoot from '@views/components/common/ExtensionRoot/ExtensionRoot';
import UTRPMap from '@views/components/map/Map';
import { Suspense } from 'react';
import { suspendUntilStoresReady } from 'src/lib/chrome-extension-toolkit/storage/createStore';

/**
 * Renders the map page for the UTRP (UT Registration Plus) extension.
 */
export default function MapPage() {
    return (
        <ExtensionRoot>
            <DialogProvider>
                <Suspense fallback={null}>
                    <MapBootstrap />
                </Suspense>
            </DialogProvider>
        </ExtensionRoot>
    );
}

function MapBootstrap() {
    suspendUntilStoresReady([UserScheduleStore]);

    return <UTRPMap />;
}
