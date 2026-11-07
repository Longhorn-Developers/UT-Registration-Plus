import { getCourseColors, useableColorways } from '@shared/util/colors/base';

export const tailwindColorways = useableColorways.map(color => getCourseColors(color));
