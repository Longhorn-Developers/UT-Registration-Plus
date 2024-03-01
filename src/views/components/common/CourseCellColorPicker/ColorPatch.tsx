import { Button } from '@views/components/common/Button/Button';
import React from 'react';
import { ThemeColor } from 'src/shared/util/themeColors';

import CheckIcon from '~icons/material-symbols/check';

/**
 * Props for the ColorPatch component
 */
interface ColorPatchProps {
    color: ThemeColor;
    index: number;
    selectedColor: number;
    handleSetSelectedColorPatch: (colorPatchIndex: number) => void;
}

/**
 *
 * @param {ColorPatchProps} props - the props for the component
 * @param {ThemeColor} props.color - the color to display
 * @param {number} props.index - the index of this color patch in the parent color palette
 * @param {number} props.selectedColor - the index of the selected color patch in the parent color palette
 * @param {(colorPatchIndex: number) => void} props.handleSetSelectedColorPatch - fn called when a color patch is selected. This function
 * is passed from the parent and updates the necessary parent state when this color patch is selected.
 * @returns {JSX.Element} - the color patch component
 */
const ColorPatch: React.FC<ColorPatchProps> = ({
    color,
    index,
    selectedColor,
    handleSetSelectedColorPatch,
}: ColorPatchProps): JSX.Element => {
    const isSelected = selectedColor === index;
    const handleClick = () => {
        if (isSelected) {
            handleSetSelectedColorPatch(-1);
        } else {
            handleSetSelectedColorPatch(index);
        }
    };
    return (
        <Button
            style={{ backgroundColor: color }}
            className='h-[22px] w-[22px] p-0'
            variant='filled'
            onClick={handleClick}
            color={color}
        >
            {isSelected && <CheckIcon className='h-[20px] w-[20px]' />}
        </Button>
    );
};

export default ColorPatch;
