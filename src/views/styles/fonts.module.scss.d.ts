/**
 * the type for all the weight scss variables exported from fonts.module.scss
 */
export interface IWeights {
    normal_weight: number;
}

/** A utility type that removes the _weight postfix from the variable names for weights */
export type Weight = keyof IWeights extends `${infer U}_weight` ? U : never;

/** A utility type that removes the _size postfix from the variable names for sizes */
export type Size = keyof ISizes extends `${infer U}_size` ? U : never;

/**
 * This is a file that we need to create to tell typescript what the shape of the css modules is
 * when we import them into ts/tsx files
 */
export type IFonts = IWeights & ISizes;

declare const fonts: IFonts;
export default fonts;
