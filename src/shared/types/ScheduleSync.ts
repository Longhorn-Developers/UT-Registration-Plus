/** What went wrong with the last schedule sync on this device, if anything */
export type ScheduleSyncProblem = 'storage-full' | null;

/** A version of a synced document (a schedule, or the custom blocks) that this device synced */
export interface ScheduleSyncDocEntry {
    /** A fingerprint of what a merge compares */
    fp: string;
    /** A hash of each course or block by its key */
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
