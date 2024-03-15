import { colors } from '@shared/util/themeColors';
import Divider from '@views/components/common/Divider/Divider';
import React from 'react';
import { theme } from 'unocss/preset-mini';

import InvertColorsIcon from '~icons/material-symbols/invert-colors';
import InvertColorsOffIcon from '~icons/material-symbols/invert-colors-off';

import ColorPatch from './ColorPatch';
import HexColorEditor from './HexColorEditor';
import HuePicker from './HuePicker';

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

interface Color {
    baseColor: string;
    shades: string[];
}

const BaseColorNum = 500;
const StartingShadeIndex = 200;
const ShadeIncrement = 100;

const colorPatchColors: Color[] = baseColors.map((baseColor: string) => {
    const shades = Array.from(
        { length: 6 },
        (_, index) => theme.colors[baseColor][StartingShadeIndex + ShadeIncrement * index]
    );
    return { baseColor: theme.colors[baseColor][BaseColorNum], shades };
});

const hexCodeToBaseColorPatchIndex = new Map(
    colorPatchColors.map((color: Color, index: number) => [color.baseColor, index])
);

interface ShadePatchInfo {
    baseColorPatchIndex: number;
    shadeColorPatchIndex: number;
}

const hexCodeToShadeColorPatchInfo = new Map<string, ShadePatchInfo>(
    colorPatchColors.flatMap((color: Color, baseColorPatchIndex: number) =>
        color.shades.map((shade: string, shadeColorPatchIndex: number) => [
            shade,
            { baseColorPatchIndex, shadeColorPatchIndex },
        ])
    )
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
    const [selectedBaseColorPatch, setSelectedBaseColorPatch] = React.useState<number>(-1);
    const [selectedShadeColorPatch, setSelectShadeColorPatch] = React.useState<number>(-1);
    const [hexCode, setHexCode] = React.useState<string>('');

    const handleSelectBaseColorPatch = (baseColorPatchIndex: number) => {
        let newHexCode = baseColorPatchIndex > -1 ? colorPatchColors[baseColorPatchIndex].baseColor : colors.ut.gray;
        newHexCode = newHexCode.slice(1).toLocaleLowerCase();
        setHexCode(newHexCode);
    };

    const handleSelectShadeColorPatch = (shadeColorPatchIndex: number) => {
        let newHexCode = colorPatchColors[selectedBaseColorPatch].shades[shadeColorPatchIndex];
        newHexCode = newHexCode.slice(1).toLocaleLowerCase();
        setHexCode(newHexCode);
    };

    React.useEffect(() => {
        const hexCodeWithHash = `#${hexCode}`.toLocaleLowerCase();
        if (hexCodeToBaseColorPatchIndex.has(hexCodeWithHash)) {
            setSelectedBaseColorPatch(hexCodeToBaseColorPatchIndex.get(hexCodeWithHash));
            setSelectShadeColorPatch(3);
        } else if (hexCodeToShadeColorPatchInfo.has(hexCodeWithHash)) {
            const { baseColorPatchIndex, shadeColorPatchIndex } = hexCodeToShadeColorPatchInfo.get(hexCodeWithHash);
            setSelectedBaseColorPatch(baseColorPatchIndex);
            setSelectShadeColorPatch(shadeColorPatchIndex);
        } else if (selectedBaseColorPatch !== -1) {
            setSelectedBaseColorPatch(-1);
            setSelectShadeColorPatch(-1);
        }

        setFinalColor(hexCodeWithHash);
    }, [hexCode, selectedBaseColorPatch, setFinalColor]);

    return (
        <div className='inline-flex flex-col border border-1 border-ut-offwhite rounded-1 p-1.25'>
            <div className='grid grid-cols-6 gap-1'>
                {colorPatchColors.map((color: Color, index) => (
                    <ColorPatch
                        color={color.baseColor}
                        index={index}
                        selectedColor={selectedBaseColorPatch}
                        handleSetSelectedColorPatch={handleSelectBaseColorPatch}
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
            {selectedBaseColorPatch !== -1 && (
                <>
                    <Divider orientation='horizontal' size='100%' className='my-1' />
                    <HuePicker
                        shades={colorPatchColors[selectedBaseColorPatch].shades}
                        selectedColor={selectedShadeColorPatch}
                        setSelectedColor={handleSelectShadeColorPatch}
                    />
                </>
            )}
        </div>
    );
}
