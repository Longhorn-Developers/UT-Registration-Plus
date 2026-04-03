import { UTRP_LOGIN_URL } from '@shared/util/appUrls';

/**
 * Checks whether the user is logged in to the UT Registrar.
 * If not logged in, opens a new tab to the login page and returns `false`.
 *
 * @returns A promise that resolves to `true` if the user is logged in, otherwise `false`.
 */
export async function validateLoginStatus() {
    try {
        const response = await fetch(UTRP_LOGIN_URL, { credentials: 'include' });

        if (response.redirected || response.status === 401 || response.status === 403) {
            chrome.tabs.create({ url: UTRP_LOGIN_URL });
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error checking login status:', error);
        return false;
    }
}
