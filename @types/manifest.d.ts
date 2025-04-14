declare namespace chrome {
    interface Manifest {
        manifest_version: number;
        name: string;
        version: string;
        description: string;
        options_page: string;
        background: {
            service_worker: string;
        };
        permissions: string[];
        host_permissions: string[];
        action: {
            default_popup: string;
            default_icon: { [key: string]: string };
        };
        icons: { [key: string]: string };
        content_scripts: {
            matches: string[];
            js: string[];
        }[];
        web_accessible_resources: {
            resources: string[];
            matches: string[];
        }[];
        content_security_policy: {
            extension_pages: string;
        };
    }
}
