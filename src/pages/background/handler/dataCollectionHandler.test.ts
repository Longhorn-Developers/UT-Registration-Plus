import { beforeEach, expect, it, vi } from 'vitest';
import browser from 'webextension-polyfill';
import dataCollectionHandler from './dataCollectionHandler';

vi.mock('webextension-polyfill', () => ({ default: { permissions: { getAll: vi.fn() } } }));
beforeEach(() => vi.resetAllMocks());

const query = async () => {
    const sendResponse = vi.fn();
    await dataCollectionHandler.getDataCollectionPermissions({ data: undefined, sender: {}, sendResponse });
    return sendResponse;
};

it('returns granted data permissions to the content script', async () => {
    vi.mocked(browser.permissions.getAll).mockResolvedValue({ data_collection: ['technicalAndInteraction'] });
    expect(await query()).toHaveBeenCalledWith(['technicalAndInteraction']);
});

it('returns no permissions when the API is unavailable or fails', async () => {
    vi.mocked(browser.permissions.getAll).mockResolvedValue({});
    expect(await query()).toHaveBeenCalledWith([]);
    vi.mocked(browser.permissions.getAll).mockRejectedValue(new Error('Unavailable'));
    expect(await query()).toHaveBeenCalledWith([]);
});
