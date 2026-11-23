import type browser from 'webextension-polyfill';

export default interface DataCollectionMessages {
    /** Returns granted data permissions for content scripts, which cannot use the permissions API. */
    getDataCollectionPermissions: () => browser.Manifest.OptionalDataCollectionPermission[];
}
