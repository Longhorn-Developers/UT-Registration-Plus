export interface ExtensionMessages {
    /**
     * Make's an API or fetch request proxying the request through the background script
     * @returns The response from the request
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    makeProxyRequest: (data: { url: string; method: string; body?: string; response: 'json' | 'text' }) => any;
}
