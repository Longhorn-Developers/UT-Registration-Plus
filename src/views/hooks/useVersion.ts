import { Serialized } from 'chrome-extension-toolkit';
import { useEffect, useState } from 'react';
import { ExtensionStore } from 'src/shared/storage/ExtensionStore';

export default function useVersion(): string {
    const [version, setVersion] = useState<string>('');

    useEffect(() => {
        const listener = ExtensionStore.listen('version', ({ newValue }) => {
            setVersion(newValue);
        });

        return () => {
            ExtensionStore.removeListener(listener);
        };
    }, []);

    return version;
}
    