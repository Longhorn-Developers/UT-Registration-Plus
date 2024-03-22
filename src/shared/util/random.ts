import { customAlphabet } from 'nanoid';

/**
 * Generate secure URL-friendly unique ID.
 *
 * @param size Size of the ID. The default size is 12.
 * @returns A random string.
 */
export const generateRandomId = customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 12);
