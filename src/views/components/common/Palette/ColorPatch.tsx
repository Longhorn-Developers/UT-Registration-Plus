import { Button } from '@views/components/common/Button/Button';
import React from 'react';

import CheckIcon from '~icons/material-symbols/check';

import { colorPatches } from './Palette';

interface ColorPatchProps {
    index: number;
    selectedColor: number;
    setSelectedColor: React.Dispatch<React.SetStateAction<number>>;
}

const ColorPatch: React.FC<ColorPatchProps> = ({ index, selectedColor, setSelectedColor }: ColorPatchProps) => {
    const color = colorPatches[index];
    const isSelected = selectedColor === index;
    const handleClick = () => {
        if (isSelected) {
            setSelectedColor(-1);
        } else {
            setSelectedColor(index);
        }
    };
    return (
        <Button className='h-[22px] w-[22px] p-0' variant='filled' color={color} onClick={handleClick}>
            {isSelected && <CheckIcon className='h-[20px] w-[20px]' />}
        </Button>
    );
};

export default ColorPatch;
