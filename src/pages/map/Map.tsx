import DialogProvider from '@views/components/common/DialogProvider/DialogProvider';
import ExtensionRoot from '@views/components/common/ExtensionRoot/ExtensionRoot';
import UTRPMap from '@views/components/map/Map';

/**
 * Renders the map page for the UTRP (UT Registration Plus) extension.
 */
export default function MapPage() {
    return (
        <ExtensionRoot>
            <DialogProvider>
                <UTRPMap />
            </DialogProvider>
        </ExtensionRoot>
    );
}
