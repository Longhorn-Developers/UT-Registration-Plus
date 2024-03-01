import { getCourseColors } from '@shared/util/colors';
import { theme } from 'unocss/preset-mini';

export const tailwindColorways = Object.keys(theme.colors)
    // check that the color is a colorway (is an object)
    .filter(color => typeof theme.colors[color] === 'object')
    .slice(0, 17)
    .map(color => getCourseColors(color as keyof typeof theme.colors));
