import {
    DIAGNOSTIC_DATA_TYPES,
    hasDataCollectionPermissions,
    setDiagnosticReportingEnabled,
} from '@shared/diagnosticReporting';
import { OptionsStore } from '@shared/storage/OptionsStore';
import { useCallback, useEffect, useRef, useState } from 'react';
import browser from 'webextension-polyfill';

export function useDiagnosticReporting() {
    const preference = OptionsStore.useStore(store => store.enableDiagnosticReporting);
    const [permissionGranted, setPermissionGranted] = useState(__BROWSER__ !== 'firefox');
    const [checking, setChecking] = useState(__BROWSER__ === 'firefox');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const revision = useRef(0);

    const refresh = useCallback(async () => {
        if (__BROWSER__ !== 'firefox') return;
        const current = ++revision.current;
        setChecking(true);
        const granted = await hasDataCollectionPermissions(DIAGNOSTIC_DATA_TYPES);
        if (current !== revision.current) return;
        setPermissionGranted(granted);
        setChecking(false);
        return granted;
    }, []);

    useEffect(() => {
        if (__BROWSER__ !== 'firefox') return;
        void refresh();
        const onPermissionsChanged = () => {
            void refresh().then(granted => {
                if (granted) setError('');
            });
        };
        browser.permissions.onAdded.addListener(onPermissionsChanged);
        browser.permissions.onRemoved.addListener(onPermissionsChanged);
        return () => {
            ++revision.current;
            browser.permissions.onAdded.removeListener(onPermissionsChanged);
            browser.permissions.onRemoved.removeListener(onPermissionsChanged);
        };
    }, [refresh]);

    const onChange = async (enabled: boolean) => {
        setSaving(true);
        setError('');
        try {
            const allowed = await setDiagnosticReportingEnabled(enabled);
            if (!allowed && enabled) {
                setError('Reporting remains off because permission was not granted.');
            }
        } catch {
            setError('Could not update reporting. Please try again.');
        } finally {
            await refresh();
            setSaving(false);
        }
    };

    return { enabled: preference && permissionGranted && !checking, pending: checking || saving, error, onChange };
}
