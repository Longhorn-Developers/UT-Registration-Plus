import { isContentScript } from '@chrome-extension-toolkit';
import { background } from '@shared/messages';
import { OptionsStore } from '@shared/storage/OptionsStore';
import browser from 'webextension-polyfill';

type DataType = browser.Manifest.OptionalDataCollectionPermission;
export const DIAGNOSTIC_DATA_TYPES: DataType[] = ['technicalAndInteraction', 'browsingActivity', 'websiteContent'];
export const FEEDBACK_DATA_TYPES: DataType[] = ['personallyIdentifyingInfo'];

export async function hasDataCollectionPermissions(dataTypes: DataType[]): Promise<boolean> {
    if (__BROWSER__ !== 'firefox') return true;

    try {
        const granted = isContentScript()
            ? await background.getDataCollectionPermissions()
            : (await browser.permissions.getAll()).data_collection;
        return dataTypes.every(type => granted?.includes(type));
    } catch {
        return false;
    }
}

// Call directly from the user's click/submit handler to preserve the user gesture.
export function requestDataCollectionPermissions(dataTypes: DataType[]): Promise<boolean> {
    if (__BROWSER__ !== 'firefox') return Promise.resolve(true);
    return browser.permissions.request({ data_collection: dataTypes });
}

export async function isDiagnosticReportingEnabled(): Promise<boolean> {
    try {
        return (
            (await OptionsStore.get('enableDiagnosticReporting')) === true &&
            (await hasDataCollectionPermissions(DIAGNOSTIC_DATA_TYPES)) &&
            (await OptionsStore.get('enableDiagnosticReporting')) === true
        );
    } catch {
        // Never send a report when the stored preference cannot be read.
        return false;
    }
}

export async function setDiagnosticReportingEnabled(enabled: boolean): Promise<boolean> {
    if (enabled && !(await requestDataCollectionPermissions(DIAGNOSTIC_DATA_TYPES))) return false;

    await OptionsStore.set('enableDiagnosticReporting', enabled);
    if (!enabled && __BROWSER__ === 'firefox') {
        await browser.permissions.remove({ data_collection: DIAGNOSTIC_DATA_TYPES });
    }
    return isDiagnosticReportingEnabled();
}
