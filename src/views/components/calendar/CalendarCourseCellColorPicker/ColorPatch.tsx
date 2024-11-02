import { useColorPickerContext } from '@views/contexts/ColorPickerContext';
import React from 'react';

import CheckIcon from '~icons/material-symbols/check';

/**
 * Props for the ColorPatch component
 */
interface ColorPatchProps {
    color: string;
    isSelected: boolean;
    handleSelectColorPatch: (color: string) => void;
    defaultColor: string;
}

/**
 * Renders a color patch square used in the CalendarCourseCellColorPicker component.
 *
 * @param {Object} props - The component props.
 * @param {string} props.color - The color value (as a hex string with a hash prefix) to display in the patch.
 * @param {boolean} props.isSelected - Indicates whether the patch is selected.
 * @param {Function} props.handleSetSelectedColor - Function from parent component to control selection state of a patch.
 *                                                  color is a hex string with a hash prefix.
 * @param {string} props.defaultColor - The default color for the color picker.
 * @returns {JSX.Element} The rendered color patch button.
 */
export default function ColorPatch({
    color,
    isSelected,
    handleSelectColorPatch,
    defaultColor,
}: ColorPatchProps): JSX.Element {
    const { handleCloseColorPicker } = useColorPickerContext();

    const handleClick = async () => {
        // If the color patch is already selected, close the color picker
        if (isSelected) {
            handleCloseColorPicker();
        } else {
            handleSelectColorPatch(isSelected ? defaultColor : color);
        }
    };
    return (
        <button
            className='h-5.5 w-5.5 p-0 transition-all duration-200 hover:scale-110 btn'
            style={{ backgroundColor: color }}
            onClick={handleClick}
        >
            {isSelected && <CheckIcon className='h-5 w-5 color-white' />}
        </button>
    );
}
