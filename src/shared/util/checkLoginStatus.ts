/**
 * Checks the login status by making a request to the provided URL.
 * If the response indicates that the user is not logged in (redirected to a login page or returns a 401/403 status),
 * it opens a new tab with the login URL and returns `false`.
 * If the user is logged in, it returns `true`.
 *
 * @param url - The URL to check the login status against.
 * @returns A promise that resolves to `true` if the user is logged in, otherwise `false`.
 */
export async function validateLoginStatus(url: string) {
    try {
        const response = await fetch(url, { credentials: 'include' });

        // Check if the response is redirecting to a login page or returning a 401/403
        if (response.redirected || response.status === 401 || response.status === 403) {
            // User is not logged in
            chrome.tabs.create({ url });
            return false;
        }

        // User is logged in
        return true;
    } catch (error) {
        console.error('Error checking login status:', error);
        return false;
    }
}
