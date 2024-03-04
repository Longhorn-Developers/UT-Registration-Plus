import { Button } from '@views/components/common/Button/Button';
import React from 'react';
import type { ThemeColor } from 'src/shared/util/themeColors';
import { getThemeColorHexByName } from 'src/shared/util/themeColors';

import InvertColorsOffIcon from '~icons/material-symbols/invert-colors-off';

import Divider from '../Divider/Divider';
import ColorPatch from './ColorPatch';
import DivWrapper from './DivWrapper';
import HexColorEditor from './HexColorEditor';
import HuePicker from './HuePicker';

interface Color {
    baseColor: ThemeColor;
    shades: ThemeColor[];
}

const colorPatches: Color[] = [
    {
        baseColor: 'palette-slateBase',
        shades: [
            'palette-slate200',
            'palette-slate300',
            'palette-slate400',
            'palette-slateBase',
            'palette-slate600',
            'palette-slate700',
        ],
    },
    {
        baseColor: 'palette-grayBase',
        shades: [
            'palette-gray200',
            'palette-gray300',
            'palette-gray400',
            'palette-grayBase',
            'palette-gray600',
            'palette-gray700',
        ],
    },
    {
        baseColor: 'palette-stoneBase',
        shades: [
            'palette-stone200',
            'palette-stone300',
            'palette-stone400',
            'palette-stoneBase',
            'palette-stone600',
            'palette-stone700',
        ],
    },
    {
        baseColor: 'palette-redBase',
        shades: [
            'palette-red200',
            'palette-red300',
            'palette-red400',
            'palette-redBase',
            'palette-red600',
            'palette-red700',
        ],
    },
    {
        baseColor: 'palette-orangeBase',
        shades: [
            'palette-orange200',
            'palette-orange300',
            'palette-orange400',
            'palette-orangeBase',
            'palette-orange600',
            'palette-orange700',
        ],
    },
    {
        baseColor: 'palette-amberBase',
        shades: [
            'palette-amber200',
            'palette-amber300',
            'palette-amber400',
            'palette-amberBase',
            'palette-amber600',
            'palette-amber700',
        ],
    },
    {
        baseColor: 'palette-yellowBase',
        shades: [
            'palette-yellow200',
            'palette-yellow300',
            'palette-yellow400',
            'palette-yellowBase',
            'palette-yellow600',
            'palette-yellow700',
        ],
    },
    {
        baseColor: 'palette-limeBase',
        shades: [
            'palette-lime200',
            'palette-lime300',
            'palette-lime400',
            'palette-limeBase',
            'palette-lime600',
            'palette-lime700',
        ],
    },
    {
        baseColor: 'palette-greenBase',
        shades: [
            'palette-green200',
            'palette-green300',
            'palette-green400',
            'palette-greenBase',
            'palette-green600',
            'palette-green700',
        ],
    },
    {
        baseColor: 'palette-emeraldBase',
        shades: [
            'palette-emerald200',
            'palette-emerald300',
            'palette-emerald400',
            'palette-emeraldBase',
            'palette-emerald600',
            'palette-emerald700',
        ],
    },
    {
        baseColor: 'palette-tealBase',
        shades: [
            'palette-teal200',
            'palette-teal300',
            'palette-teal400',
            'palette-tealBase',
            'palette-teal600',
            'palette-teal700',
        ],
    },
    {
        baseColor: 'palette-cyanBase',
        shades: [
            'palette-cyan200',
            'palette-cyan300',
            'palette-cyan400',
            'palette-cyanBase',
            'palette-cyan600',
            'palette-cyan700',
        ],
    },
    {
        baseColor: 'palette-skyBase',
        shades: [
            'palette-sky200',
            'palette-sky300',
            'palette-sky400',
            'palette-skyBase',
            'palette-sky600',
            'palette-sky700',
        ],
    },
    {
        baseColor: 'palette-blueBase',
        shades: [
            'palette-blue200',
            'palette-blue300',
            'palette-blue400',
            'palette-blueBase',
            'palette-blue600',
            'palette-blue700',
        ],
    },
    {
        baseColor: 'palette-indigoBase',
        shades: [
            'palette-indigo200',
            'palette-indigo300',
            'palette-indigo400',
            'palette-indigoBase',
            'palette-indigo600',
            'palette-indigo700',
        ],
    },
    {
        baseColor: 'palette-violetBase',
        shades: [
            'palette-violet200',
            'palette-violet300',
            'palette-violet400',
            'palette-violetBase',
            'palette-violet600',
            'palette-violet700',
        ],
    },
    {
        baseColor: 'palette-purpleBase',
        shades: [
            'palette-purple200',
            'palette-purple300',
            'palette-purple400',
            'palette-purpleBase',
            'palette-purple600',
            'palette-purple700',
        ],
    },
    {
        baseColor: 'palette-fuschiaBase',
        shades: [
            'palette-fuschia200',
            'palette-fuschia300',
            'palette-fuschia400',
            'palette-fuschiaBase',
            'palette-fuschia600',
            'palette-fuschia700',
        ],
    },
    {
        baseColor: 'palette-pinkBase',
        shades: [
            'palette-pink200',
            'palette-pink300',
            'palette-pink400',
            'palette-pinkBase',
            'palette-pink600',
            'palette-pink700',
        ],
    },
    {
        baseColor: 'palette-roseBase',
        shades: [
            'palette-rose200',
            'palette-rose300',
            'palette-rose400',
            'palette-roseBase',
            'palette-rose600',
            'palette-rose700',
        ],
    },
];

const hexCodeToBaseColorPatchIndex = new Map(
    colorPatches.map((color: Color, index: number) => [getThemeColorHexByName(color.baseColor), index])
);

const hexCodeToShadeColorPatchIndex = new Map(
    colorPatches.flatMap((color: Color, index: number) =>
        color.shades.map(shade => [getThemeColorHexByName(shade), index])
    )
);

/**
 * Props for the CourseCellColorPicker component.
 */
export interface CourseCellColorPickerProps {
    setSelectedColor: React.Dispatch<React.SetStateAction<string | null>>;
}

/**
 * @param {CourseCellColorPickerProps} props - the props for the component
 * @param {React.Dispatch<React.SetStateAction<string | null>>} props.setSelectedColor - set state function passed down from the parent component
 * that will be called when a color is selected. The user can set any valid hex color they want.
 *
 * @example
 * ```
 * const CourseCell = () => {
 *     const [selectedColor, setSelectedColor] = useState<string | null>(null);
 *     ...
 *     return (
 *      <div style={{ backgroundColor: selectedColor }}>
           ...
 *         <CourseCellColorPicker setSelectedColor={setSelectedColor} />
 *     );
 * };
 * ```
 * 
 * @returns {JSX.Element} - the color picker component that displays a color palette with a list of color patches.
 * This component is available when a user hovers over a course cell in their calendar to
 * color for the course cell. The user can set any valid hex color they want.
 */
const CourseCellColorPicker: React.FC<CourseCellColorPickerProps> = ({
    setSelectedColor: setFinalColor,
}: CourseCellColorPickerProps): JSX.Element => {
    const [selectedBaseColorPatch, setSelectedBaseColorPatch] = React.useState<number>(-1);
    const [selectedShadeColorPatch, setSelectShadeColorPatch] = React.useState<number>(-1);
    const [hexCode, setHexCode] = React.useState<string>('');
    const numColumns = 6;
    const numFullRows = 3;

    const handleSelectBaseColorPatch = (baseColorPatchIndex: number) => {
        const color = baseColorPatchIndex > -1 ? colorPatches[baseColorPatchIndex].baseColor : 'ut-gray';
        const newHexCode = baseColorPatchIndex > -1 ? getThemeColorHexByName(color).slice(1) : '';
        setHexCode(newHexCode);
        setSelectedBaseColorPatch(baseColorPatchIndex);
        setSelectShadeColorPatch(3);
    };

    const handleSelectShadeColorPatch = (shadeColorPatchIndex: number) => {
        const color = colorPatches[selectedBaseColorPatch].shades[shadeColorPatchIndex];
        const newHexCode = getThemeColorHexByName(color).slice(1);
        setHexCode(newHexCode);
        setSelectShadeColorPatch(shadeColorPatchIndex);
    };

    React.useEffect(() => {
        const hexCodeWithHash = `#${hexCode}`;
        if (hexCodeToBaseColorPatchIndex.has(hexCodeWithHash)) {
            setSelectedBaseColorPatch(hexCodeToBaseColorPatchIndex.get(hexCodeWithHash));
        }
        if (hexCodeToShadeColorPatchIndex.has(hexCodeWithHash)) {
            setSelectedBaseColorPatch(hexCodeToShadeColorPatchIndex.get(hexCodeWithHash));
        }
        if (!hexCodeToBaseColorPatchIndex.has(hexCodeWithHash) && !hexCodeToShadeColorPatchIndex.has(hexCodeWithHash)) {
            setSelectedBaseColorPatch(-1);
        }
    }, [hexCode]);

    React.useEffect(() => {
        let finalColor: string | null = null;
        if (selectedBaseColorPatch === -1 && hexCode.length === 6) {
            finalColor = `#${hexCode}`;
        } else if (selectedBaseColorPatch > -1 && selectedShadeColorPatch === -1) {
            finalColor = getThemeColorHexByName(colorPatches[selectedBaseColorPatch].baseColor);
        } else if (selectedBaseColorPatch > -1 && selectedShadeColorPatch > -1) {
            finalColor = getThemeColorHexByName(colorPatches[selectedBaseColorPatch].shades[selectedShadeColorPatch]);
        } else {
            finalColor = null;
        }
        console.log('finalColor', finalColor);
        setFinalColor(finalColor);
    }, [hexCode, selectedBaseColorPatch, selectedShadeColorPatch, setFinalColor]);

    return (
        <div className='inline-flex flex-col border border-1 border-ut-offwhite rounded-1 p-[5px]'>
            {Array.from({ length: numFullRows }, (_, rowIndex) => (
                <div className='flex gap-0 flex-content-between' key={rowIndex}>
                    {colorPatches.map((color: Color, index) => {
                        if (index >= rowIndex * numColumns && index < (rowIndex + 1) * numColumns) {
                            return (
                                <DivWrapper key={color.baseColor}>
                                    <ColorPatch
                                        color={color.baseColor}
                                        index={index}
                                        selectedColor={selectedBaseColorPatch}
                                        handleSetSelectedColorPatch={handleSelectBaseColorPatch}
                                    />
                                </DivWrapper>
                            );
                        }
                        return null;
                    })}
                </div>
            ))}
            <div className='flex gap-0 flex-content-between'>
                <DivWrapper>
                    <ColorPatch
                        color={colorPatches[colorPatches.length - 2].baseColor}
                        index={colorPatches.length - 2}
                        selectedColor={selectedBaseColorPatch}
                        handleSetSelectedColorPatch={handleSelectBaseColorPatch}
                    />
                </DivWrapper>
                <DivWrapper>
                    <ColorPatch
                        color={colorPatches[colorPatches.length - 1].baseColor}
                        index={colorPatches.length - 1}
                        selectedColor={selectedBaseColorPatch}
                        handleSetSelectedColorPatch={handleSelectBaseColorPatch}
                    />
                </DivWrapper>
                <div className='flex items-center justify-center overflow-hidden p-[2px]'>
                    <HexColorEditor hexCode={hexCode} setHexCode={setHexCode} />
                </div>
                <DivWrapper>
                    {/* TODO (achadaga): Not really sure what this button is actually supposed to do */}
                    <Button className='h-[22px] w-[22px] p-0' variant='filled' color='ut-black' onClick={() => {}}>
                        <InvertColorsOffIcon className='h-[14px] w-[14px]' />
                    </Button>
                </DivWrapper>
            </div>
            <Divider orientation='horizontal' size='100%' className='my-1' />
            {selectedBaseColorPatch !== -1 && (
                <HuePicker
                    shades={colorPatches[selectedBaseColorPatch].shades}
                    selectedColor={selectedShadeColorPatch}
                    setSelectedColor={handleSelectShadeColorPatch}
                />
            )}
        </div>
    );
};

export default CourseCellColorPicker;
