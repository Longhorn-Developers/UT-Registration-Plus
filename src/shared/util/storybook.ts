import { getCourseColors } from '@shared/util/colors';
import { theme } from 'unocss/preset-mini';

export const tailwindColorways = Object.keys(theme.colors)
    // check that the color is a colorway (is an object)
    .filter((color: string) => typeof theme.colors[color as keyof typeof theme.colors] === 'object')
    .slice(0, 17)
    .map(color => getCourseColors(color as keyof typeof theme.colors));
