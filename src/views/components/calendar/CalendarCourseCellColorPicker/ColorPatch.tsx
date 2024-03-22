import { getThemeColorHexByName } from '@shared/util/themeColors';
import React from 'react';

import CheckIcon from '~icons/material-symbols/check';

/**
 * Props for the ColorPatch component
 */
interface ColorPatchProps {
    color: string;
    isSelected: boolean;
    handleSetSelectedColor: (color: string) => void;
}

/**
 * Renders a color patch square used in the CalendarCourseCellColorPicker component.
 *
 * @param {Object} props - The component props.
 * @param {string} props.color - The color value (as a hex string with a hash prefix) to display in the patch.
 * @param {boolean} props.isSelected - Indicates whether the patch is selected.
 * @param {Function} props.handleSetSelectedColor - Function from parent component to control selection state of a patch.
 *                                                  color is a hex string with a hash prefix.
 * @returns {JSX.Element} The rendered color patch button.
 */
export default function ColorPatch({ color, isSelected, handleSetSelectedColor }: ColorPatchProps): JSX.Element {
    const handleClick = () => {
        handleSetSelectedColor(isSelected ? getThemeColorHexByName('ut-gray') : color);
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
