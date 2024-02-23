import { ExtensionStore } from '@shared/storage/ExtensionStore';
import { useEffect, useState } from 'react';

/**
 * Custom hook that retrieves the version from ExtensionStore and updates it when it changes.
 * @returns The current version as a string.
 */
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
