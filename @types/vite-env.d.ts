/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_PACKAGE_VERSION: string;
    readonly VITE_SENTRY_ENVIRONMENT: string;
    readonly VITE_BETA_BUILD?: 'true';
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
