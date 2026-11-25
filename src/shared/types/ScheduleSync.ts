/**
 * Whether the sync storage was full on the last schedule sync on this device. It stays null when a sync fails for any
 * other reason, which the console reports instead.
 */
export type ScheduleSyncProblem = 'storage-full' | null;

/** A version of a synced document (a schedule, or the custom blocks) that this device synced */
export interface ScheduleSyncDocEntry {
    /** A fingerprint of what a merge compares */
    fp: string;
    /** A hash of each course or block by its key, and the hash of the schedule's name under `#name`, which a merge
     * uses to tell which device renamed it */
    items: Record<string, string>;
    h: string;
    m: number;
    a: string[];
    /** The items of the versions it came from, newest first, to merge against when another upload clashed with it */
    bases?: { h: string; items: Record<string, string> }[];
}

/** What this device last synced */
export interface ScheduleSyncState {
    v: number;
    initialized: boolean;
    docs: Record<string, ScheduleSyncDocEntry>;
    orderFp: string;
    orderAt: number;
}
