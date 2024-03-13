import { colors } from '@shared/util/themeColors';
import Divider from '@views/components/common/Divider/Divider';
import React from 'react';

import InvertColorsIcon from '~icons/material-symbols/invert-colors';
import InvertColorsOffIcon from '~icons/material-symbols/invert-colors-off';

import ColorPatch from './ColorPatch';
import DivWrapper from './DivWrapper';
import HexColorEditor from './HexColorEditor';
import HuePicker from './HuePicker';

interface Color {
    baseColor: string;
    shades: string[];
}

const colorPatchColors: Color[] = [
    {
        baseColor: '#64748b',
        shades: ['#e2e8f0', '#cbd5e1', '#94a3b8', '#64748B', '#475569', '#334155'],
    },
    {
        baseColor: '#6b7280',
        shades: ['#e5e7eb', '#d1d5db', '#9ca3af', '#6b7280', '#4b5563', '#374151'],
    },
    {
        baseColor: '#78716c',
        shades: ['#e7e5e4', '#d6d3d1', '#a8a29e', '#78716c', '#57534e', '#44403c'],
    },
    {
        baseColor: '#ef4444',
        shades: ['#fecaca', '#fca5a5', '#f87171', '#ef4444', '#dc2626', '#b91c1c'],
    },
    {
        baseColor: '#f97316',
        shades: ['#fed7aa', '#fdba74', '#fb923c', '#f97316', '#ea580c', '#c2410c'],
    },
    {
        baseColor: '#f59e0b',
        shades: ['#fde68a', '#fcd34d', '#fbbf24', '#f59e0b', '#d97706', '#b45309'],
    },
    {
        baseColor: '#eab308',
        shades: ['#fef08a', '#fde047', '#facc15', '#eab308', '#ca8a04', '#a16207'],
    },
    {
        baseColor: '#84cc16',
        shades: ['#d9f99d', '#bef264', '#a3e635', '#84cc16', '#65a30d', '#4d7c0f'],
    },
    {
        baseColor: '#22c55e',
        shades: ['#bbf7d0', '#86efac', '#4ade80', '#22c55e', '#16a34a', '#15803d'],
    },
    {
        baseColor: '#10b981',
        shades: ['#a7f3d0', '#6ee7b7', '#34d399', '#10b981', '#059669', '#047857'],
    },
    {
        baseColor: '#14b8a6',
        shades: ['#99f6e4', '#5eead4', '#2dd4bf', '#14b8a6', '#0d9488', '#0f766e'],
    },
    {
        baseColor: '#06b6d4',
        shades: ['#a5f3fc', '#67e8f9', '#22d3ee', '#06B6D4', '#0891b2', '#0e7490'],
    },
    {
        baseColor: '#0ea5e9',
        shades: ['#bae6fd', '#7dd3fc', '#38bdf8', '#0ea5e9', '#0284c7', '#0369a1'],
    },
    {
        baseColor: '#3b82f6',
        shades: ['#bfdbfe', '#93c5fd', '#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8'],
    },
    {
        baseColor: '#6366f1',
        shades: ['#c7d2fe', '#a5b4fc', '#818cf8', '#6366f1', '#4f46e5', '#4338ca'],
    },
    {
        baseColor: '#8b5cf6',
        shades: ['#ddd6fe', '#c4b5fd', '#a78bfa', '#8b5cf6', '#7c3aed', '#6d28d9'],
    },
    {
        baseColor: '#a855f7',
        shades: ['#e9d5ff', '#d8b4fe', '#c084fc', '#a855f7', '#9333ea', '#7e22ce'],
    },
    {
        baseColor: '#d946ef',
        shades: ['#f5d0fe', '#f0abfc', '#e879f9', '#d946ef', '#c026d3', '#a21caf'],
    },
    {
        baseColor: '#ec4899',
        shades: ['#fbcfe8', '#f9a8d4', '#f472b6', '#ec4899', '#db2777', '#be185d'],
    },
    {
        baseColor: '#f43f5e',
        shades: ['#fecdd3', '#fda4af', '#fb7185', '#f43f5e', '#e11d48', '#be123c'],
    },
];

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
    isInvertColorsToggled,
    setIsInvertColorsToggled,
}: CourseCellColorPickerProps): JSX.Element => {
    const [selectedBaseColorPatch, setSelectedBaseColorPatch] = React.useState<number>(-1);
    const [selectedShadeColorPatch, setSelectShadeColorPatch] = React.useState<number>(-1);
    const [hexCode, setHexCode] = React.useState<string>('');
    const numColumns = 6;
    const numFullRows = 3;

    const handleSelectBaseColorPatch = (baseColorPatchIndex: number) => {
        let newHexCode = baseColorPatchIndex > -1 ? colorPatchColors[baseColorPatchIndex].baseColor : colors.ut.gray;
        newHexCode = newHexCode.slice(1);
        setHexCode(newHexCode);
    };

    const handleSelectShadeColorPatch = (shadeColorPatchIndex: number) => {
        let newHexCode = colorPatchColors[selectedBaseColorPatch].shades[shadeColorPatchIndex];
        newHexCode = newHexCode.slice(1);
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
        <div className='inline-flex flex-col border border-1 border-ut-offwhite rounded-1 p-[5px]'>
            {Array.from({ length: numFullRows }, (_, rowIndex) => (
                <div className='flex gap-0 flex-content-between' key={rowIndex}>
                    {colorPatchColors.map((color: Color, index) => {
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
                        color={colorPatchColors[colorPatchColors.length - 2].baseColor}
                        index={colorPatchColors.length - 2}
                        selectedColor={selectedBaseColorPatch}
                        handleSetSelectedColorPatch={handleSelectBaseColorPatch}
                    />
                </DivWrapper>
                <DivWrapper>
                    <ColorPatch
                        color={colorPatchColors[colorPatchColors.length - 1].baseColor}
                        index={colorPatchColors.length - 1}
                        selectedColor={selectedBaseColorPatch}
                        handleSetSelectedColorPatch={handleSelectBaseColorPatch}
                    />
                </DivWrapper>
                <div className='flex items-center justify-center overflow-hidden p-[2px]'>
                    <HexColorEditor hexCode={hexCode} setHexCode={setHexCode} />
                </div>
                <DivWrapper>
                    <button
                        className='h-[22px] w-[22px] bg-ut-black p-0 transition-all duration-200 hover:scale-110 btn'
                        onClick={() => {
                            console.log('inverting colors');
                            setIsInvertColorsToggled(prev => !prev);
                        }}
                    >
                        {isInvertColorsToggled ? (
                            <InvertColorsIcon className='h-[14px] w-[14px] color-white' />
                        ) : (
                            <InvertColorsOffIcon className='h-[14px] w-[14px] color-white' />
                        )}
                    </button>
                </DivWrapper>
            </div>
            <Divider orientation='horizontal' size='100%' className='my-1' />
            {selectedBaseColorPatch !== -1 && (
                <HuePicker
                    shades={colorPatchColors[selectedBaseColorPatch].shades}
                    selectedColor={selectedShadeColorPatch}
                    setSelectedColor={handleSelectShadeColorPatch}
                />
            )}
        </div>
    );
};

export default CourseCellColorPicker;
