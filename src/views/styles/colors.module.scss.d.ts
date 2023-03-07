/**
 * This is a file that we need to create to tell typescript what the shape of the css modules is
 * when we import them into ts/tsx files
 */
export interface ISassColors {
    burnt_orange: string;
    charcoal: string;
    white: string;
    black: string;
    tangerine: string;
    sunshine: string;
    cactus: string;
    turtle_pond: string;
    turquoise: string;
    bluebonnet: string;
    shade: string;
    limestone: string;
    speedway_brick: string;
}

/**
 * A type that represents all the colors that we have in our sass files
 */
export type Color = keyof ISassColors;

declare const colors: ISassColors;
export default colors;
