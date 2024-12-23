import type { MIMETypeKey } from '../types/MIMEType';
import MIMEType from '../types/MIMEType';

/**
 * Downloads a blob by creating a temporary URL and triggering a download.
 *
 * @param blobPart - The blob data to be downloaded.
 * @param type - The MIME type of the blob.
 * @param fileName - The name of the file to be downloaded.
 * @returns A promise that resolves when the download is successful, or rejects with an error if the download fails.
 */
export function downloadBlob(blobPart: BlobPart, type: MIMETypeKey, fileName: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const blob: Blob = new Blob([blobPart], { type: MIMEType[type] });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');

        link.href = url;
        link.download = fileName;

        link.addEventListener('click', () => {
            resolve();
        });
        link.addEventListener('error', () => {
            URL.revokeObjectURL(url);
            reject(new Error('Download failed'));
        });
        link.click();
        URL.revokeObjectURL(url);
    });
}
