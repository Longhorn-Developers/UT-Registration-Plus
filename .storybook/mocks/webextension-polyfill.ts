// Dynamic Storybook mock for `webextension-polyfill`.
// This provides a minimal implementation of the `browser` API
function makeFallback() {
    return {
        runtime: {
            id: 'storybook-mock',
            getManifest() {
                return { manifest_version: 3, name: 'storybook-mock', version: '0.0.0' };
            },
            onMessage: {
                addListener() {},
                removeListener() {},
            },
        },
        storage: {
            local: {
                async get() {
                    return {};
                },
                async set() {},
                async remove() {},
                async clear() {},
                async getBytesInUse() {
                    return 0;
                },
            },
            onChanged: { addListener() {}, removeListener() {} },
        },
    } as any;
}

const fallback = makeFallback();

const browserProxy = new Proxy(fallback, {
    get(target, prop) {
        const real = (globalThis as any).browser || (globalThis as any).chrome;
        if (real && prop in real) {
            const val = real[prop as keyof typeof real];
            return typeof val === 'function' ? val.bind(real) : val;
        }
        const val = target[prop as keyof typeof target];
        return typeof val === 'function' ? val.bind(target) : val;
    },
});

export default browserProxy;
