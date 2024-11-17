/**
 *
 */
export default async function getExtensionStorage() {
    try {
        const storageData = await chrome.storage.local.get(null);
        console.log(storageData);
    } catch (error) {
        console.error('Error getting storage data:', error);
    }
}
