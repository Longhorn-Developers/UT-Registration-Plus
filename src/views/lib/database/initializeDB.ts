import initSqlJs from 'sql.js/dist/sql-wasm';

const WASM_FILE_URL = chrome.runtime.getURL('database/sql-wasm.wasm');
const DB_FILE_URL = chrome.runtime.getURL('database/grades.db');

/**
 * A utility type for the SQL.js Database type
 */
export type Database = initSqlJs.Database;

/**
 * We only want to load the database into memory once, so we store a reference to the database here.
 */
let db: Database;

/**
 * This function loads the database into memory and returns a reference to the sql.js Database object.
 * @returns a reference to the sql.js Database object
 */
export async function initializeDB(): Promise<Database> {
    if (!WASM_FILE_URL || !DB_FILE_URL) {
        throw new Error('WASM_FILE_URL or DB_FILE_URL is undefined');
    }
    if (db) {
        return db;
    }
    const { Database } = await initSqlJs({
        locateFile: file => WASM_FILE_URL,
    });

    const dbBuffer = await fetch(DB_FILE_URL).then(res => res.arrayBuffer());
    db = new Database(new Uint8Array(dbBuffer));

    return db;
}
