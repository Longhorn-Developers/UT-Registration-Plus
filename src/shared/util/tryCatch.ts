/**
 * A utility function to handle promises with try-catch.
 *
 * Just supply it with a promise and it will return a tuple:
 * - data: The resolved value of the promise (or null if it failed)
 * - error: The error thrown by the promise (or null if it succeeded)
 *
 * Example usage:
 *
 * ```typescript
 * const [data, error] = await tryCatch(fetchData());
 * if (error) {
 *   console.error('Error fetching data:', error);
 *   return;
 *   }
 *   console.log('Data:', data);
 *   }
 * ```
 */
export async function tryCatch<T, E = Error>(promise: T | Promise<T>) {
    try {
        const data = await promise;
        return [data, null] as const;
    } catch (error) {
        return [null, error as E] as const;
    }
}
