import React from 'react';
import type { ThemeColor } from 'src/shared/util/themeColors';

import InvertColorsOffIcon from '~icons/material-symbols/invert-colors-off';

import { Button } from '../Button/Button';
import Divider from '../Divider/Divider';
import ColorPatch from './ColorPatch';
import HexColorEditor from './HexColorEditor';

const NumCols = 6;
export const colorPatches = [
    'palette-slate500',
    'palette-gray500',
    'palette-stone500',
    'palette-red500',
    'palette-orange500',
    'palette-amber500',
    'palette-yellow500',
    'palette-lime500',
    'palette-green500',
    'palette-emerald500',
    'palette-teal500',
    'palette-cyan500',
    'palette-sky500',
    'palette-blue500',
    'palette-indigo500',
    'palette-violet500',
    'palette-purple500',
    'palette-fuschia500',
    'palette-pink500',
    'palette-rose500',
] satisfies ThemeColor[];

const Palette: React.FC = () => {
    const [selectedColor, setSelectedColor] = React.useState<number>(-1);

    return (
        <div className='inline-flex flex-col border border-1 border-ut-offwhite rounded-1 p-[5px]'>
            {Array.from({ length: 3 }, (_, rowIndex) => (
                <div className='flex gap-0 flex-content-between' key={rowIndex}>
                    {colorPatches.map((color, index) => {
                        if (index >= rowIndex * NumCols && index < (rowIndex + 1) * NumCols) {
                            return (
                                <div className='h-[26px] w-[26px] flex items-center justify-center p-[2px]'>
                                    <ColorPatch
                                        key={color}
                                        index={index}
                                        selectedColor={selectedColor}
                                        setSelectedColor={setSelectedColor}
                                    />
                                </div>
                            );
                        }
                        return null;
                    })}
                </div>
            ))}
            <div className='flex gap-0 flex-content-between'>
                <div className='h-[26px] w-[26px] flex items-center justify-center p-[2px]'>
                    <ColorPatch
                        index={colorPatches.length - 2}
                        selectedColor={selectedColor}
                        setSelectedColor={setSelectedColor}
                    />
                </div>
                <div className='h-[26px] w-[26px] flex items-center justify-center p-[2px]'>
                    <ColorPatch
                        index={colorPatches.length - 1}
                        selectedColor={selectedColor}
                        setSelectedColor={setSelectedColor}
                    />
                </div>
                <div className='flex items-center justify-center overflow-hidden p-[2px]'>
                    <HexColorEditor />
                </div>
                <div className='flex items-center justify-center p-[2px]'>
                    <Button className='h-[22px] w-[22px] p-0' variant='filled' color='ut-black' onClick={() => {}}>
                        <InvertColorsOffIcon className='h-[14px] w-[14px]' />
                    </Button>
                </div>
            </div>
            <Divider orientation='horizontal' size='100%' className='my-1' />
        </div>
    );
};

export default Palette;
