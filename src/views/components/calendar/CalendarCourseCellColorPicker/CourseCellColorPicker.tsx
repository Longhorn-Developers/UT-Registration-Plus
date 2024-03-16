import { getThemeColorHexByName } from '@shared/util/themeColors';
import Divider from '@views/components/common/Divider/Divider';
import React from 'react';
import { theme } from 'unocss/preset-mini';

import InvertColorsIcon from '~icons/material-symbols/invert-colors';
import InvertColorsOffIcon from '~icons/material-symbols/invert-colors-off';

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
];

const BaseColorNum = 500;
const StartingShadeIndex = 200;
const ShadeIncrement = 100;

const colorPatchColors = new Map<string, string[]>(
    baseColors.map((baseColor: string) => [
        theme.colors[baseColor][BaseColorNum],
        Array.from({ length: 6 }, (_, index) => theme.colors[baseColor][StartingShadeIndex + ShadeIncrement * index]),
    ])
);

const hexCodeToBaseColor = new Map<string, string>(
    Array.from(colorPatchColors.entries()).flatMap(([baseColor, shades]) => shades.map(shade => [shade, baseColor]))
);

/**
 * Props for the CourseCellColorPicker component.
 */
export interface CourseCellColorPickerProps {
    setSelectedColor: React.Dispatch<React.SetStateAction<string | null>>;
    isInvertColorsToggled: boolean;
    setIsInvertColorsToggled: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * @param {CourseCellColorPickerProps} props - the props for the component
 * @param {React.Dispatch<React.SetStateAction<string | null>>} props.setSelectedColor - set state function passed down from the parent component
 * @param {boolean} props.isInvertColorsToggled - boolean state passed down from the parent component that indicates whether the color picker is in invert colors mode
 * @param {React.Dispatch<React.SetStateAction<boolean>>} props.setIsInvertColorsToggled - set state function passed down from the parent component to set invert colors mode
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
 * @returns {JSX.Element} - the color picker component that displays a color palette with a list of color patches.
 * This component is available when a user hovers over a course cell in their calendar to
 * color for the course cell. The user can set any valid hex color they want.
 */
export default function CourseCellColorPicker({
    setSelectedColor: setFinalColor,
    isInvertColorsToggled,
    setIsInvertColorsToggled,
}: CourseCellColorPickerProps): JSX.Element {
    // hexCode mirrors contents of HexColorEditor which has no hash prefix
    const [hexCode, setHexCode] = React.useState<string>(
        getThemeColorHexByName('ut-gray').slice(1).toLocaleLowerCase()
    );
    const hexCodeWithHash = `#${hexCode}`;
    const selectedBaseColor = hexCodeToBaseColor.get(hexCodeWithHash);

    const handleSelectColorPatch = (baseColor: string) => {
        setHexCode(baseColor.slice(1).toLocaleLowerCase());
    };

    React.useEffect(() => {
        setFinalColor(hexCodeWithHash);
    }, [hexCodeWithHash, setFinalColor]);

    return (
        <div className='inline-flex flex-col border border-1 border-ut-offwhite rounded-1 p-1.25'>
            <div className='grid grid-cols-6 gap-1'>
                {Array.from(colorPatchColors.keys()).map(baseColor => (
                    <ColorPatch
                        color={baseColor}
                        isSelected={baseColor === selectedBaseColor}
                        handleSetSelectedColor={handleSelectColorPatch}
                    />
                ))}
                <div className='col-span-3 flex items-center justify-center overflow-hidden'>
                    <HexColorEditor hexCode={hexCode} setHexCode={setHexCode} />
                </div>
                <button
                    className='h-5.5 w-5.5 bg-ut-black p-0 transition-all duration-200 hover:scale-110 btn'
                    onClick={() => setIsInvertColorsToggled(prev => !prev)}
                >
                    {isInvertColorsToggled ? (
                        <InvertColorsIcon className='h-3.5 w-3.5 color-white' />
                    ) : (
                        <InvertColorsOffIcon className='h-3.5 w-3.5 color-white' />
                    )}
                </button>
            </div>
            {hexCodeToBaseColor.has(hexCodeWithHash) && (
                <>
                    <Divider orientation='horizontal' size='100%' className='my-1' />
                    <div className='grid grid-cols-6 gap-1'>
                        {colorPatchColors
                            .get(selectedBaseColor)
                            ?.map(shadeColor => (
                                <ColorPatch
                                    color={shadeColor}
                                    isSelected={shadeColor === hexCodeWithHash}
                                    handleSetSelectedColor={handleSelectColorPatch}
                                />
                            ))}
                    </div>
                </>
            )}
        </div>
    );
}
