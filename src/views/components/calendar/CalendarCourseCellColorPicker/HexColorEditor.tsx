import { isValidHexColor, pickFontColor } from '@shared/util/colors';
import { getThemeColorHexByName } from '@shared/util/themeColors';
import clsx from 'clsx';
import React from 'react';

import TagIcon from '~icons/material-symbols/tag';

/**
 * Props for the HexColorEditor component
 */
export interface HexColorEditorProps {
    hexCode: string;
    setHexCode: (hexCode: string) => void;
}

/**
 * Utility component to allow the user to enter a valid hex color code
 *
 * @param props - the props for the component
 * @param props.hexCode - the current hex color code displayed in this component. Note that this code does not
 * include the leading '#' character since it is already included in the component. Passed down from the parent component.
 * @param props.setHexCode - set state fn to control the hex color code from parent
 * @returns the hex color editor component
 */
export default function HexColorEditor({ hexCode, setHexCode }: HexColorEditorProps): JSX.Element {
    const baseColor = React.useMemo(() => getThemeColorHexByName('ut-gray'), []);
    const previewColor = isValidHexColor(`#${hexCode}`) ? `#${hexCode}` : baseColor;
    const tagColor = pickFontColor(previewColor.slice(1) as `#${string}`);

    return (
        <>
            <div
                style={{ backgroundColor: previewColor }}
                className='h-5.5 w-5.25 flex items-center justify-center rounded-l-1'
            >
                <TagIcon className={clsx('h-4 w-4 text-color-white', tagColor)} />
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
