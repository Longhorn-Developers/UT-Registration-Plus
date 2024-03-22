import { getCourseColors, useableColorways } from '@shared/util/colors';

export const tailwindColorways = useableColorways.map(color => getCourseColors(color));
