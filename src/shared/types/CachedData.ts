/**
 * Represents cached data with its fetch timestamp
 * @template T The type of the cached data
 */
export type CachedData<T> = {
    data: T;
    dataFetched: number;
};
