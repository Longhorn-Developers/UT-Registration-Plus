export interface IWeights {
    light: number;
    regular: number;
    medium: number;
    bold: number;
    semi_bold: number;
    black: number;
}

export interface ISizes {
    x_small: number;
    small: number;
    medium: number;
    large: number;
    x_large: number;
    xx_large: number;
}

/**
 * This is a file that we need to create to tell typescript what the shape of the css modules is
 * when we import them into ts/tsx files
 */
export type IFonts = IWeights & ISizes;

declare const fonts: IFonts;
export default fonts;
