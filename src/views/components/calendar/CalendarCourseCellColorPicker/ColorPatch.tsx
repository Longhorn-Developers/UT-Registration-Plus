import React from 'react';

import CheckIcon from '~icons/material-symbols/check';

/**
 * Props for the ColorPatch component
 */
interface ColorPatchProps {
    color: string;
    index: number;
    selectedColor: number;
    handleSetSelectedColorPatch: (colorPatchIndex: number) => void;
}

/**
 *
 * @param {ColorPatchProps} props - the props for the component
 * @param {string} props.color - the color to display as a hex string
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
        handleSetSelectedColorPatch(isSelected ? -1 : index);
    };
    return (
        <button
            className='h-[22px] w-[22px] p-0 transition-all duration-200 hover:scale-110 btn'
            style={{ backgroundColor: color }}
            onClick={handleClick}
        >
            {isSelected && <CheckIcon className='h-5 w-5 color-white' />}
        </button>
    );
};

export default ColorPatch;
