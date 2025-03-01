import presetUno from '@unocss/preset-uno';
import presetWebFonts from '@unocss/preset-web-fonts';
import transformerDirectives from '@unocss/transformer-directives';
import transformerVariantGroup from '@unocss/transformer-variant-group';
import { defineConfig } from 'unocss';

import { spacing } from './src/shared/types/Spacing';
import { colors } from './src/shared/types/ThemeColors';

export default defineConfig({
    rules: [
        [
            'btn-transition',
            {
                transition:
                    'color 180ms ease-in, border-color 150ms ease-in, background-color 150ms ease-in, box-shadow 200ms ease-in, transform 50ms ease-in',
            },
        ],
        [
            'ring-offset-0',
            {
                '--un-ring-offset-width': '0px',
            },
        ],
        ['font-all-small-caps', { 'font-variant-caps': 'all-small-caps' }],
    ],
    shortcuts: {
        focusable: 'outline-none ring-blue-500/50 dark:ring-blue-400/60 ring-0 focus-visible:ring-4',
        btn: 'h-10 w-auto flex cursor-pointer justify-center items-center gap-spacing-3 rounded-1 px-spacing-5 py-0 text-4.5 btn-transition disabled:(cursor-not-allowed opacity-50) active:enabled:scale-96 active:has-enabled:scale-96 focusable',
        link: 'text-ut-burntorange link:text-ut-burntorange underline underline-offset-2 hover:text-ut-orange focus-visible:text-ut-orange focusable btn-transition ease-out-expo',
        linkanimate:
            'relative cursor-pointer transition duration-100 ease-out after:(absolute left-0.4 right-0.4 h-2px scale-x-95 bg-ut-orange opacity-0 transition duration-250 ease-out-expo content-empty -bottom-0.75 -translate-y-0.5) active:scale-95 hover:text-ut-orange focus-visible:text-ut-orange hover:after:(opacity-100) !hover:after:translate-y-0 !hover:after:scale-x-100',
    },
    theme: {
        easing: {
            'in-out-expo': 'cubic-bezier(.46, 0, .21, 1)',
            'out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
        },
        colors,
        spacing,
    },
    variants: [
        matcher => {
            const search = 'screenshot:';
            if (!matcher.startsWith(search)) return matcher;
            return {
                matcher: matcher.slice(search.length),
                selector: s => `.screenshot-in-progress ${s}`,
            };
        },
    ],
    presets: [
        presetUno(),
        presetWebFonts({
            provider: 'none',
            fonts: {
                sans: ['Roboto Flex', 'Roboto Flex Local'],
                mono: ['Roboto Mono', 'Roboto Mono Local'],
            },
        }),
    ],
    transformers: [transformerVariantGroup(), transformerDirectives()],
});
