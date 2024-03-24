import DB_FILE_URL from '@public/database/grade_distributions.db?url';
import initSqlJs from 'sql.js/dist/sql-wasm';
import WASM_FILE_URL from 'sql.js/dist/sql-wasm.wasm?url';
// import WASM_FILE_URL from '../../../../public/database/sql-wasm.wasm?url';

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

    const [{ Database }, dbBuffer] = await Promise.all([
        initSqlJs({
            locateFile: () => WASM_FILE_URL,
        }),
        fetch(DB_FILE_URL).then(res => res.arrayBuffer()),
    ]);

    db = new Database(new Uint8Array(dbBuffer));

    return db;
}
