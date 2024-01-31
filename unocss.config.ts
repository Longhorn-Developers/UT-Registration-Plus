import presetUno from '@unocss/preset-uno';
import presetWebFonts from '@unocss/preset-web-fonts';
import transformerDirectives from '@unocss/transformer-directives';
import transformerVariantGroup from '@unocss/transformer-variant-group';
import { defineConfig } from 'unocss';
import { theme } from 'unocss/preset-mini';

export default defineConfig({
    rules: [
        ['btn-transition', { transition: 'color 180ms, border-color 150ms, background-color 150ms, transform 50ms' }],
        [
            'ring-offset-0',
            {
                '--un-ring-offset-width': '0px',
            },
        ],
    ],
    shortcuts: {
        btn: `
      btn-transition inline-flex h-10 items-center justify-center gap-1 rounded-lg border-2 border-transparent px-3 font-medium disabled:cursor-not-allowed disabled:opacity-70
      outline-none ring-blue-500/50 dark:ring-blue-400/60 ring-0 focus-visible:ring-4
      active:scale-[0.96] disabled:active:scale-100
      `,
        focusable: 'outline-none ring-blue-500/50 dark:ring-blue-400/60 ring-0 focus-visible:ring-4',
    },
    theme: {
        easing: {
            'in-out-expo': 'cubic-bezier(.46, 0, .21, 1)',
            'out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
        },
        colors: {
            ut: {
                'burnt-orange': '#BF5700',
                black: '#333F48',
                orange: '#f8971f',
                yellow: '#ffd600',
                'light-green': '#a6cd57',
                green: '#579d42',
                teal: '#00a9b7',
                blue: '#005f86',
                gray: '#9cadb7',
                'off-white': '#d6d2c4',
                concrete: '#95a5a6',
            },
            theme: {
                red: '#af2e2d',
                black: '#1a2024',
            },
        },
        breakpoints: {
            xs: '410px',
            ...theme.breakpoints,
        },
    },

    presets: [
        presetUno(),
        presetWebFonts({
            provider: 'google',
            fonts: {
                sans: {
                    name: 'Roboto',
                    weights: ['300', '400', '600', '700'],
                    italic: true,
                },
                mono: {
                    name: 'Azeret Mono',
                    weights: ['500'],
                },
            },
        }),
    ],
    transformers: [transformerVariantGroup(), transformerDirectives()],
});
