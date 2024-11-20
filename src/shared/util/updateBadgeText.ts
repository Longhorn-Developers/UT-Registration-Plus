import { colors } from '../types/ThemeColors';
import { MILLISECOND } from './time';

/** How long should we flash the badge when it changes value */
export const POPUP_FLASH_TIME = 200 * MILLISECOND;

/** The maximum number to show in the badge, after which we show a '+' */
export const BADGE_LIMIT = 10;

/**
 * Updates the badge text based on the given value.
 * If the value is greater than the badge limit, it sets the badge text to the badge limit followed by a '+'.
 * @param value - The value to be displayed in the badge.
 */
export default function updateBadgeText(value: number): void {
    let badgeText = '';
    if (value >= 0) {
        if (value > BADGE_LIMIT) {
            badgeText = `${BADGE_LIMIT}+`;
        } else {
            badgeText = `${value}`;
        }
    }
    chrome.action.setBadgeText({ text: badgeText });
    flashBadgeColor();
}

/**
 * Flashes the badge color by setting the badge background color to a color and then resetting it after a short delay.
 */
function flashBadgeColor() {
    chrome.action.setBadgeBackgroundColor({ color: colors.ut.burntorange });
    setTimeout(() => chrome.action.setBadgeBackgroundColor({ color: colors.ut.orange }), POPUP_FLASH_TIME);
}
