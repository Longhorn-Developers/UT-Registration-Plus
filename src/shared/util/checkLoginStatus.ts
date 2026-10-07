import { UTRP_LOGIN_URL } from '@shared/util/appUrls';

/**
 * Checks whether the user is logged in to the UT Registrar.
 * Performs a cookie-only auth check and returns a pure boolean; callers own any UI affordance.
 *
 * @returns A promise that resolves to `true` if the user is logged in, otherwise `false`.
 */
export async function validateLoginStatus(): Promise<boolean> {
    try {
        const response = await fetch(UTRP_LOGIN_URL, { credentials: 'include' });

        if (response.redirected || response.status === 401 || response.status === 403) {
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error checking login status:', error);
        return false;
    }
}
