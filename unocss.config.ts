import presetUno from '@unocss/preset-uno';
import presetWebFonts from '@unocss/preset-web-fonts';
import transformerDirectives from '@unocss/transformer-directives';
import transformerVariantGroup from '@unocss/transformer-variant-group';
import { defineConfig } from 'unocss';

import { colors } from './src/shared/util/themeColors';

export default defineConfig({
    rules: [
        [
            'btn-transition',
            { transition: 'color 180ms, border-color 150ms, background-color 150ms, box-shadow 0ms, transform 50ms' },
        ],
        [
            'ring-offset-0',
            {
                '--un-ring-offset-width': '0px',
            },
        ],
    ],
    shortcuts: {
        focusable: 'outline-none ring-blue-500/50 dark:ring-blue-400/60 ring-0 focus-visible:ring-4',
        btn: 'h-10 w-auto flex cursor-pointer justify-center items-center gap-2 rounded-1 px-4 py-0 text-4.5 btn-transition disabled:(cursor-not-allowed opacity-50) active:enabled:scale-96 focusable',
        link: 'text-ut-burntorange underline underline-offset-2 hover:text-ut-orange focus-visible:text-ut-orange focusable btn-transition ease-out-expo',
    },
    theme: {
        easing: {
            'in-out-expo': 'cubic-bezier(.46, 0, .21, 1)',
            'out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
        },
        colors,
    },

    presets: [
        presetUno(),
        presetWebFonts({
            provider: 'none',
            fonts: {
                sans: ['Roboto Flex', 'Roboto Flex Local'],
            },
        }),
    ],
    transformers: [transformerVariantGroup(), transformerDirectives()],
});
