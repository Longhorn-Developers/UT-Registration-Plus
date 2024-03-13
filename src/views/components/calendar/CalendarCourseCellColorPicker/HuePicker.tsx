import React from 'react';

import ColorPatch from './ColorPatch';
import DivWrapper from './DivWrapper';

/**
 * Props for the HuePicker component
 */
interface HuePickerProps {
    shades: string[];
    selectedColor: number;
    setSelectedColor: React.Dispatch<React.SetStateAction<number>>;
}

/**
 * Bottom row of the color picker component that displays all the shades of a base color
 *
 * @param {HuePickerProps} props - the props for the component
 * @param {string[]} props.shades - an array of hex codes for the shades of the base color
 * @param {number} props.selectedColor - the index of the selected color patch in the parent color palette
 * @param {React.Dispatch<React.SetStateAction<number>>} props.setSelectedColor - set state fn to control the selected color patch from parent
 * @returns {JSX.Element} - the hue picker component
 */
const HuePicker: React.FC<HuePickerProps> = ({
    shades,
    selectedColor,
    setSelectedColor,
}: HuePickerProps): JSX.Element => {
    const numColumns = 6;
    return (
        <div className='flex gap-0 flex-content-between'>
            {Array.from({ length: numColumns }, (_, index) => (
                <DivWrapper key={shades[index]}>
                    <ColorPatch
                        color={shades[index]}
                        index={index}
                        selectedColor={selectedColor}
                        handleSetSelectedColorPatch={setSelectedColor}
                    />
                </DivWrapper>
            ))}
        </div>
    );
};

export default HuePicker;
