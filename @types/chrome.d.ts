declare namespace chrome {
    interface Runtime {
        getURL(path: string): string;
        onInstalled: {
            addListener(callback: (details: { reason: string }) => void): void;
        };
        // Add more Chrome Runtime methods as needed
    }

    interface Storage {
        local: {
            set(items: object, callback?: () => void): void;
            get(keys: string | string[], callback: (items: object) => void): void;
            // Add more Storage methods as needed
        };
    }

    // Add more Chrome API interfaces as needed
}
