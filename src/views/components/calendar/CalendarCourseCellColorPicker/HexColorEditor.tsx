import { Hash } from '@phosphor-icons/react';
import { getThemeColorHexByName } from '@shared/util/themeColors';
import React from 'react';

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
 * @param hexCode - The current hex color code displayed in this component. Note that this code does not
 * include the leading '#' character since it is already included in the component. Passed down from the parent component.
 * @param setHexCode - Set state fn to control the hex color code from parent
 * @returns The HexColorEditor component
 */
export default function HexColorEditor({ hexCode, setHexCode }: HexColorEditorProps): JSX.Element {
    const baseColor = React.useMemo(() => getThemeColorHexByName('ut-gray'), []);
    const previewColor = hexCode.length === 6 ? `#${hexCode}` : baseColor;

    return (
        <>
            <div
                style={{ backgroundColor: previewColor }}
                className='h-5.5 w-5.25 flex items-center justify-center rounded-l-1'
            >
                <Hash className='h-4 w-4 text-color-white' />
            </div>
            <div className='h-5.5 w-[53px] flex flex-1 items-center justify-center border-b border-r border-t rounded-br rounded-tr p-1.25'>
                <input
                    type='text'
                    maxLength={6}
                    className='w-full border-none bg-transparent font-size-2.75 font-normal outline-none focus:outline-none'
                    value={hexCode}
                    onChange={e => setHexCode(e.target.value)}
                />
            </div>
        </>
    );
}
