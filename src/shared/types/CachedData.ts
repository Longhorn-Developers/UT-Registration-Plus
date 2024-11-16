/**
 * Represents cached data with its fetch timestamp
 */
export type CachedData<T> = {
    data: T;
    dataFetched: number;
};
