/**
 * Downloads a blob as a file.
 * @param blob - The blob to download.
 * @param fileName - The name of the file to be downloaded.
 * @returns A promise that resolves when the download is complete.
 */
export default async function downloadBlob(blob: Blob, fileName: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');

        link.href = url;
        link.download = fileName;

        link.addEventListener('click', () => {
            URL.revokeObjectURL(url);
            resolve();
        });
        link.addEventListener('error', () => {
            URL.revokeObjectURL(url);
            reject(new Error('Download failed'));
        });
        link.click();
    });
}
