import { ExtensionStore } from '@shared/storage/ExtensionStore';
import { useEffect, useState } from 'react';

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
