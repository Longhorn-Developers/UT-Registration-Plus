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
            { transition: 'color 180ms, border-color 150ms, background-color 150ms, box-shadow 100ms, transform 50ms' },
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
        btn: 'h-10 w-auto flex cursor-pointer justify-center items-center gap-2 rounded-1 px-4 py-0 text-4.5 btn-transition btn-transition disabled:(cursor-not-allowed opacity-50) active:enabled:scale-96 focusable',
        divider: 'border-solid border-ut-offwhite w-0 h-0',
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
                sans: {
                    name: 'Roboto Flex',
                },
            },
        }),
    ],
    transformers: [transformerVariantGroup(), transformerDirectives()],
});
