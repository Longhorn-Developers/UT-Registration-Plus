import type { ThemeColor, TWIndex } from '@shared/types/ThemeColors';
import { getThemeColorHexByName } from '@shared/util/themeColors';
import Divider from '@views/components/common/Divider';
import { useColorPickerContext } from '@views/contexts/ColorPickerContext';
import React from 'react';
import { theme } from 'unocss/preset-mini';

import ColorPatch from './ColorPatch';
import HexColorEditor from './HexColorEditor';

const baseColors = [
    'slate',
    'gray',
    'stone',
    'red',
    'orange',
    'amber',
    'yellow',
    'lime',
    'green',
    'emerald',
    'teal',
    'cyan',
    'sky',
    'blue',
    'indigo',
    'violet',
    'purple',
    'fuchsia',
    'pink',
    'rose',
] as const;

const BaseColorNum: TWIndex = 500;
const StartingShadeIndex: TWIndex = 200;
const ShadeIncrement = 100;

const colorPatchColors = new Map<string, string[]>(
    baseColors.map(baseColor => [
        theme.colors[baseColor][BaseColorNum],
        Array.from(
            { length: 6 },
            (_, index) => theme.colors[baseColor][(StartingShadeIndex + ShadeIncrement * index) as TWIndex]
        ),
    ])
);

const hexCodeToBaseColor = new Map<string, string>(
    Array.from(colorPatchColors.entries()).flatMap(([baseColor, shades]) => shades.map(shade => [shade, baseColor]))
);

/**
 * Props for the CourseCellColorPicker component.
 */
export interface CourseCellColorPickerProps {
    defaultColor: string;
}

/**
 * The CourseCellColorPicker component that displays a color palette with a list of color patches.
 *
 * @remarks This component is available when a user hovers over a course cell in their calendar to
 * color for the course cell. The user can set any valid hex color they want.
 *
 * @param setSelectedColor - Set state function passed down from the parent component
 * @param isInvertColorsToggled - Boolean state passed down from the parent component that indicates whether the color picker is in invert colors mode
 * @param setIsInvertColorsToggled - Set state function passed down from the parent component to set invert colors mode
 * that will be called when a color is selected. The user can set any valid hex color they want.
 *
 * @example
 * ```
 *   const [selectedColor, setSelectedColor] = useState<string | null>(null);
 *   const [isInvertColorsToggled, setIsInvertColorsToggled] = useState<boolean>(false);
 *   return (
 *       <CourseCellColorPicker
 *           setSelectedColor={setSelectedColor}
 *           isInvertColorsToggled={isInvertColorsToggled}
 *           setIsInvertColorsToggled={setIsInvertColorsToggled}
 *       />
 *   );
 * ```
 *
 * @returns The color picker component that displays a color palette with a list of color patches.
 */
export default function CourseCellColorPicker({ defaultColor }: CourseCellColorPickerProps): JSX.Element {
    // hexCode mirrors contents of HexColorEditor which has no hash prefix
    const [hexCode, setHexCode] = React.useState<string>(
        defaultColor.slice(1).toLocaleLowerCase() || getThemeColorHexByName('ut-gray')
    );

    const { setSelectedColor } = useColorPickerContext();

    const hexCodeWithHash = `#${hexCode}` as ThemeColor;
    const selectedBaseColor = hexCodeToBaseColor.get(hexCodeWithHash);

    const handleSelectColorPatch = (baseColor: string) => {
        let hexCode = baseColor.toLocaleLowerCase();

        if (hexCode.startsWith('#')) {
            hexCode = baseColor.slice(1);
        }

        setHexCode(hexCode);
        setSelectedColor(`#${hexCode}` as ThemeColor);
    };

    return (
        <div className='inline-flex flex-col border border-ut-offwhite rounded-1 bg-white p-1.25'>
            <div className='grid grid-cols-6 gap-1'>
                {Array.from(colorPatchColors.keys()).map(baseColor => (
                    <ColorPatch
                        key={baseColor}
                        color={baseColor}
                        isSelected={baseColor === selectedBaseColor}
                        handleSelectColorPatch={handleSelectColorPatch}
                        defaultColor={defaultColor}
                    />
                ))}
                <div className='col-span-3 flex items-center justify-center overflow-hidden'>
                    <HexColorEditor hexCode={hexCode} setHexCode={handleSelectColorPatch} />
                </div>
            </div>
            {selectedBaseColor && (
                <>
                    <Divider orientation='horizontal' size='100%' className='my-1' />
                    <div className='grid grid-cols-6 gap-1'>
                        {colorPatchColors
                            .get(selectedBaseColor)
                            ?.map(shadeColor => (
                                <ColorPatch
                                    key={shadeColor}
                                    color={shadeColor}
                                    isSelected={shadeColor === hexCodeWithHash}
                                    handleSelectColorPatch={handleSelectColorPatch}
                                    defaultColor={defaultColor}
                                />
                            ))}
                    </div>
                </>
            )}
        </div>
    );
}
