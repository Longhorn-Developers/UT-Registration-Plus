export const MILLISECOND = 1;
export const SECOND = 1000 * MILLISECOND;
export const MINUTE = 60 * SECOND;
export const HOUR = 60 * MINUTE;
export const DAY = 24 * HOUR;

/**
 * Pauses the execution for the specified number of milliseconds.
 *
 * @param milliseconds - The number of milliseconds to sleep.
 * @returns A promise that resolves after the specified number of milliseconds.
 */
export const sleep = (milliseconds: number): Promise<void> => new Promise(resolve => setTimeout(resolve, milliseconds));

/**
 * Parses an `HH:mm` string (for example from `<input type="time">`) into minutes from midnight.
 *
 * @param value - A string with hour and minute separated by `:`.
 * @returns Total minutes from 00:00, or `null` if the format is invalid or parts are not finite numbers.
 */
export function parseTimeToMinutes(value: string): number | null {
    const parts = value.split(':').map(Number);
    const h = parts[0];
    const m = parts[1];
    if (h === undefined || m === undefined || !Number.isFinite(h) || !Number.isFinite(m)) {
        return null;
    }
    return h * 60 + m;
}

/**
 * Formats minutes from midnight as `HH:mm` for `<input type="time">` values.
 *
 * @param totalMinutes - Whole minutes from 00:00 (typically 0–1439 for a single day).
 */
export function minutesToTimeInputValue(totalMinutes: number): string {
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/**
 * Checks to see if expired by the time first stored and the time frame that it is stored for
 *
 * @param time - time it was stored
 * @param threshold - time frame it can be stored for
 * @returns true if expired, false if the time frame is still in range
 */
export const didExpire = (time: number, threshold: number): boolean => time + threshold <= Date.now();
