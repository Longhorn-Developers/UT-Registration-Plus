import DB_FILE_URL from '@public/database/grade_distributions.db?url';
import initSqlJs from 'sql.js/dist/sql-wasm';
import WASM_FILE_URL from 'sql.js/dist/sql-wasm.wasm?url';

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

    console.log('WASM_FILE_URL:', WASM_FILE_URL);
    console.log('DB_FILE_URL:', DB_FILE_URL);

    if (db) {
        console.log('Database already initialized');
        return db;
    }

    // Load the WASM and database files in parallel
    const [{ Database }, dbBuffer] = await Promise.all([
        initSqlJs({
            locateFile: () => WASM_FILE_URL,
        }),
        fetch(DB_FILE_URL).then(res => res.arrayBuffer()),
    ]);

    console.log('Promise.all resolved');

    try {
        // BUG: The error is in this line
        // Error: Permission denied to access property "constructor"
        db = new Database(new Uint8Array(dbBuffer));
    } catch (error) {
        console.error('Error initializing database:', error);
        throw error;
    }

    console.log('Database initialized');

    return db;
}
