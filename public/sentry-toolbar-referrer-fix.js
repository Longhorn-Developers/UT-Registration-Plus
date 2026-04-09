// Rewrites the `referrer` variable in Sentry toolbar iframe inline scripts
// so postMessage targets the real chrome-extension:// origin instead of the
// fake localhost referrer injected by declarativeNetRequest.
const realOrigin = location.ancestorOrigins?.[0];
if (realOrigin) {
    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeName === 'SCRIPT' && !node.src && node.textContent?.includes("const referrer = '")) {
                    node.textContent = node.textContent.replace(
                        /const referrer = '[^']*'/,
                        `const referrer = '${realOrigin}'`
                    );
                }
            }
        }
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
}
