import React from 'react';

import TagIcon from '~icons/material-symbols/tag';

const HexColorEditor: React.FC = () => {
    const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            alert('Enter key pressed');
            e.preventDefault();
        }
    };

    return (
        <div className='h-[22px] w-[74px] flex items-center border-[0.5px] border-ut-gray/50 rounded-1'>
            <div className='h-[22px] w-[21px] flex items-center justify-center rounded-l-1 bg-ut-gray -m-[0.5px]'>
                <TagIcon className='h-[16px] w-[16px] text-ut-white' />
            </div>
            <div className='flex flex-1 items-center justify-center p-[5px]'>
                <input
                    type='text'
                    maxLength={6}
                    className='box-border w-full border-none bg-transparent font-size-[11px] font-400 font-normal outline-none focus:outline-none'
                    onKeyDown={handleEnter}
                />
            </div>
        </div>
    );
};

export default HexColorEditor;
