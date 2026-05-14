/**
 * Vite plugin that aggregates all processed CSS into a virtual module
 * exporting a live `CSSStyleSheet` — ideal for injecting styles into Shadow DOM.
 *
 * Dev:  wraps Vite's `updateStyle`/`removeStyle` (exported by `/@vite/client`)
 *       so every CSS change is captured client-side into a shared `CSSStyleSheet`.
 *       No server-side CSS tracking or manual HMR invalidation needed — updates
 *       flow through Vite's own CSS HMR → `updateStyle` → sheet.replaceSync().
 * Build: collects CSS assets in `generateBundle` and inlines them
 *        into the virtual module's chunk.
 *
 * @example
 * ```ts
 * import viteStyles from 'virtual:inline-styles';
 * shadowRoot.adoptedStyleSheets = [viteStyles];
 * ```
 */
import type { Plugin } from 'vite';

const VIRTUAL_ID = 'virtual:inline-styles';
const RESOLVED_ID = '/__inline-styles';

const HOOKS_RESOLVED_ID = '/__inline-styles-hooks';

const BUILD_PLACEHOLDER = '__VITE_INLINE_STYLES__';

export function inlineStyles(): Plugin[] {
    return [
        // ── Dev ────────────────────────────────────────────────────
        {
            name: 'vite-inline-styles',
            apply: 'serve',
            enforce: 'post',

            resolveId(id) {
                if (id === VIRTUAL_ID) return RESOLVED_ID;
                if (id === HOOKS_RESOLVED_ID) return HOOKS_RESOLVED_ID;
            },

            load(id) {
                if (id === RESOLVED_ID) {
                    return `import { sheet } from '${HOOKS_RESOLVED_ID}';\nexport default sheet;`;
                }
                if (id === HOOKS_RESOLVED_ID) {
                    return hooksModule();
                }
            },

            transform(code, id) {
                if (id.includes('vite/dist/client/client.mjs')) {
                    return transformViteClient(code);
                }
            },
        },

        // ── Build ──────────────────────────────────────────────────
        {
            name: 'vite-inline-styles:build',
            apply: 'build',
            enforce: 'post',

            resolveId(id) {
                if (id === VIRTUAL_ID) return RESOLVED_ID;
            },

            load(id) {
                if (id !== RESOLVED_ID) return;
                return [
                    `const sheet = new CSSStyleSheet();`,
                    `sheet.replaceSync("${BUILD_PLACEHOLDER}");`,
                    `export default sheet;`,
                ].join('\n');
            },

            generateBundle(_, bundle) {
                const css: string[] = [];
                for (const chunk of Object.values(bundle)) {
                    if (chunk.type === 'asset' && chunk.fileName.endsWith('.css')) {
                        css.push(chunk.source as string);
                    }
                }

                const aggregated = css.join('\n');
                const placeholderRe = new RegExp(`["'\`]${BUILD_PLACEHOLDER}["'\`]`, 'g');

                for (const chunk of Object.values(bundle)) {
                    if (chunk.type === 'chunk' && chunk.code.includes(BUILD_PLACEHOLDER)) {
                        chunk.code = chunk.code.replace(placeholderRe, JSON.stringify(aggregated));
                    }
                }
            },
        },
    ];
}

/**
 * Transforms `/@vite/client` to re-export wrapped `updateStyle`/`removeStyle`
 * from our hooks module, so every CSS update also feeds the shared CSSStyleSheet.
 */
function transformViteClient(code: string): string {
    const exportRe = /export\s*\{([^}]*)\}\s*;?\s*$/;
    const match = code.match(exportRe);
    if (!match) return code;

    const exports = match[1] ?? '';
    const filteredExports = exports
        .split(',')
        .map(e => e.trim())
        .filter(e => e !== 'updateStyle' && e !== 'removeStyle')
        .join(', ');

    let transformed = code.replace(exportRe, `export { ${filteredExports} };`);

    transformed += `
import { __wrapUpdateStyle as ___wU, __wrapRemoveStyle as ___wR } from '${HOOKS_RESOLVED_ID}';
const ___wrappedU = ___wU(updateStyle);
const ___wrappedR = ___wR(removeStyle);
export { ___wrappedU as updateStyle, ___wrappedR as removeStyle };
`;

    return transformed;
}

/** Client-side module that maintains a CSSStyleSheet fed by updateStyle/removeStyle calls. */
function hooksModule(): string {
    return `\
const cssMap = new Map();
export const sheet = typeof CSSStyleSheet !== 'undefined' ? new CSSStyleSheet() : undefined;

function rebuildSheet() {
    sheet.replaceSync([...cssMap.values()].join('\\n'));
}

export function __wrapUpdateStyle(original) {
    if (!sheet) return original;
    return function updateStyle(id, content) {
        original(id, content);
        const prev = cssMap.get(id);
        if (prev !== content) {
            cssMap.set(id, content);
            rebuildSheet();
        }
    };
}

export function __wrapRemoveStyle(original) {
    if (!sheet) return original;
    return function removeStyle(id) {
        original(id);
        if (cssMap.has(id)) {
            cssMap.delete(id);
            rebuildSheet();
        }
    };
}
`;
}
