import { getThemeColorHexByName } from '@shared/util/themeColors';
import React from 'react';

import TagIcon from '~icons/material-symbols/tag';

/**
 * Props for the HexColorEditor component
 */
export interface HexColorEditorProps {
    hexCode: string;
    setHexCode: React.Dispatch<React.SetStateAction<string>>;
}

/**
 * Utility component to allow the user to enter a valid hex color code
 *
 * @param {HexColorEditorProps} props - the props for the component
 * @param {string} props.hexCode - the current hex color code displayed in this component. Note that this code does not
 * include the leading '#' character since it is already included in the component. Passed down from the parent component.
 * @param {React.Dispatch<React.SetStateAction<string>>} props.setHexCode - set state fn to control the hex color code from parent
 * @returns {JSX.Element} - the hex color editor component
 */
export default function HexColorEditor({ hexCode, setHexCode }: HexColorEditorProps): JSX.Element {
    const baseColor = React.useMemo(() => getThemeColorHexByName('ut-gray'), []);
    const previewColor = hexCode.length === 6 ? `#${hexCode}` : baseColor;

    return (
        <div className='h-5.5 w-18.5 flex items-center border-0.125 border-ut-gray/50 rounded-1'>
            <div
                style={{ backgroundColor: previewColor }}
                className='h-5.5 w-5.25 flex items-center justify-center rounded-l-1 -m-0.125'
            >
                <TagIcon className='h-4 w-4 text-color-white' />
            </div>
            <div className='flex flex-1 items-center justify-center p-1.25'>
                <input
                    type='text'
                    maxLength={6}
                    className='box-border w-full border-none bg-transparent font-size-2.75 font-400 font-normal outline-none focus:outline-none'
                    value={hexCode}
                    onChange={e => setHexCode(e.target.value)}
                />
            </div>
        </div>
    );
}
