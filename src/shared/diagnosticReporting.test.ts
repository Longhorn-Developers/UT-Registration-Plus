import { isContentScript } from '@chrome-extension-toolkit';
import { background } from '@shared/messages';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import browser from 'webextension-polyfill';
import {
    DIAGNOSTIC_DATA_TYPES,
    FEEDBACK_DATA_TYPES,
    hasDataCollectionPermissions,
    isDiagnosticReportingEnabled,
    requestDataCollectionPermissions,
    setDiagnosticReportingEnabled,
} from './diagnosticReporting';
import { OptionsStore } from './storage/OptionsStore';

vi.mock('./storage/OptionsStore', () => ({
    OptionsStore: { get: vi.fn(), set: vi.fn() },
}));
vi.mock('@chrome-extension-toolkit', () => ({ isContentScript: vi.fn() }));
vi.mock('@shared/messages', () => ({ background: { getDataCollectionPermissions: vi.fn() } }));
vi.mock('webextension-polyfill', () => ({
    default: { permissions: { getAll: vi.fn(), request: vi.fn(), remove: vi.fn() } },
}));

const grant = (dataTypes: typeof DIAGNOSTIC_DATA_TYPES) => {
    vi.mocked(browser.permissions.getAll).mockResolvedValue({ data_collection: dataTypes });
};

beforeEach(() => {
    vi.resetAllMocks();
    vi.stubGlobal('__BROWSER__', 'firefox');
    vi.mocked(OptionsStore.get).mockResolvedValue(true);
    vi.mocked(OptionsStore.set).mockResolvedValue();
    grant(DIAGNOSTIC_DATA_TYPES);
});
afterEach(() => vi.unstubAllGlobals());

describe('diagnostic reporting', () => {
    it('keeps Chrome reporting enabled without Firefox permission APIs', async () => {
        vi.stubGlobal('__BROWSER__', 'chrome');
        expect(await isDiagnosticReportingEnabled()).toBe(true);
        expect(browser.permissions.getAll).not.toHaveBeenCalled();
    });

    it.each(['chrome', 'firefox'])('honors the saved opt-out on %s', async browserName => {
        vi.stubGlobal('__BROWSER__', browserName);
        vi.mocked(OptionsStore.get).mockResolvedValue(false);
        expect(await isDiagnosticReportingEnabled()).toBe(false);
    });

    it('requires all diagnostic permissions on Firefox', async () => {
        grant(['technicalAndInteraction']);
        expect(await isDiagnosticReportingEnabled()).toBe(false);
        grant(DIAGNOSTIC_DATA_TYPES);
        expect(await isDiagnosticReportingEnabled()).toBe(true);
    });

    it('rechecks permissions for already-open contexts after revocation', async () => {
        expect(await isDiagnosticReportingEnabled()).toBe(true);
        grant([]);
        expect(await isDiagnosticReportingEnabled()).toBe(false);
    });

    it('checks Firefox content-script permissions through the background', async () => {
        vi.mocked(isContentScript).mockReturnValue(true);
        vi.mocked(background.getDataCollectionPermissions).mockResolvedValue(DIAGNOSTIC_DATA_TYPES);
        expect(await isDiagnosticReportingEnabled()).toBe(true);
        expect(browser.permissions.getAll).not.toHaveBeenCalled();
        vi.mocked(background.getDataCollectionPermissions).mockResolvedValue([]);
        expect(await isDiagnosticReportingEnabled()).toBe(false);
    });

    it('sends nothing if the permission API is unavailable or fails', async () => {
        vi.mocked(browser.permissions.getAll).mockResolvedValue({});
        expect(await isDiagnosticReportingEnabled()).toBe(false);
        vi.mocked(browser.permissions.getAll).mockRejectedValue(new Error('Unavailable'));
        expect(await isDiagnosticReportingEnabled()).toBe(false);
    });

    it('sends nothing if the preference cannot be loaded', async () => {
        vi.mocked(OptionsStore.get).mockRejectedValue(new Error('Storage unavailable'));
        expect(await isDiagnosticReportingEnabled()).toBe(false);
    });

    it('honors an opt-out while a permission check is pending', async () => {
        vi.mocked(browser.permissions.getAll).mockImplementation(async () => {
            vi.mocked(OptionsStore.get).mockResolvedValue(false);
            return { data_collection: DIAGNOSTIC_DATA_TYPES };
        });
        expect(await isDiagnosticReportingEnabled()).toBe(false);
    });

    it('does not change the preference when Firefox denies the request', async () => {
        vi.mocked(browser.permissions.request).mockResolvedValue(false);
        expect(await setDiagnosticReportingEnabled(true)).toBe(false);
        expect(OptionsStore.set).not.toHaveBeenCalled();
    });

    it('requests consent before saving an enabled preference', async () => {
        vi.mocked(browser.permissions.request).mockResolvedValue(true);
        expect(await setDiagnosticReportingEnabled(true)).toBe(true);
        expect(browser.permissions.request).toHaveBeenCalledWith({ data_collection: DIAGNOSTIC_DATA_TYPES });
        expect(OptionsStore.set).toHaveBeenCalledWith('enableDiagnosticReporting', true);
    });

    it('disables reporting before removing only the diagnostic permissions', async () => {
        await setDiagnosticReportingEnabled(false);
        expect(OptionsStore.set).toHaveBeenCalledWith('enableDiagnosticReporting', false);
        expect(browser.permissions.remove).toHaveBeenCalledWith({ data_collection: DIAGNOSTIC_DATA_TYPES });
        expect(vi.mocked(OptionsStore.set).mock.invocationCallOrder[0]).toBeLessThan(
            vi.mocked(browser.permissions.remove).mock.invocationCallOrder[0] as number
        );
    });

    it('keeps feedback permission independent of diagnostics', async () => {
        grant(FEEDBACK_DATA_TYPES);
        expect(await hasDataCollectionPermissions(FEEDBACK_DATA_TYPES)).toBe(true);
        expect(await isDiagnosticReportingEnabled()).toBe(false);
        await requestDataCollectionPermissions(FEEDBACK_DATA_TYPES);
        expect(browser.permissions.request).toHaveBeenCalledWith({ data_collection: FEEDBACK_DATA_TYPES });
    });

    it('saves Chrome choices without calling Firefox permission APIs', async () => {
        vi.stubGlobal('__BROWSER__', 'chrome');
        await setDiagnosticReportingEnabled(false);
        expect(OptionsStore.set).toHaveBeenCalledWith('enableDiagnosticReporting', false);
        expect(browser.permissions.request).not.toHaveBeenCalled();
        expect(browser.permissions.remove).not.toHaveBeenCalled();
    });
});
