export const MILLISECOND = 1;
export const SECOND = 1000 * MILLISECOND;
export const MINUTE = 60 * SECOND;
export const HOUR = 60 * MINUTE;
export const DAY = 24 * HOUR;

/**
 *
 */
export const sleep = (milliseconds: number): Promise<void> => new Promise(resolve => setTimeout(resolve, milliseconds));

/**
 * Checks to see if expired by the time first stored and the time frame that it is stored for
 *
 * @param time time it was stored
 * @param threshold time frame it can be stored for
 * @return true if expired, false if the time frame is still in range
 */
export const didExpire = (time: number, threshold: number): boolean => time + threshold <= Date.now();
