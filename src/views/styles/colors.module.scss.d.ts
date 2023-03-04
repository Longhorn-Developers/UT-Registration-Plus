/**
 * This is a file that we need to create to tell typescript what the shape of the css modules is
 * when we import them into ts/tsx files
 */
export interface ISassColors {
    BURNT_ORANGE: string;
    CHARCOAL: string;
    WHITE: string;
    TANGERINE: string;
    SUNSHINE: string;
    CACTUS: string;
    TURTLE_POND: string;
    TURQUOISE: string;
    BLUEBONNET: string;
    SHADE: string;
    LIMESTONE: string;
}

declare const colors: ISassColors;
export default colors;
