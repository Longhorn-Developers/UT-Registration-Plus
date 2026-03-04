declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: 'development' | 'production' | 'test';
            CI?: string;
            EXTENSION_STORAGE_PASSWORD?: string;
        }
    }

    type Environment = typeof process.env.NODE_ENV;
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
