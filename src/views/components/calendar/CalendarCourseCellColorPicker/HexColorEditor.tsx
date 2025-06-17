import { Hash } from '@phosphor-icons/react';
import { isValidHexColor, pickFontColor } from '@shared/util/colors';
import { getThemeColorHexByName } from '@shared/util/themeColors';
import { useDebounce } from '@views/hooks/useDebounce';
import clsx from 'clsx';
import React from 'react';

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
 * @param hexCode - The current hex color code displayed in this component. Note that this code does not
 * include the leading '#' character since it is already included in the component. Passed down from the parent component.
 * @param setHexCode - Set state fn to control the hex color code from parent
 * @returns The HexColorEditor component
 */
export default function HexColorEditor({ hexCode, setHexCode }: HexColorEditorProps): JSX.Element {
    const baseColor = React.useMemo(() => getThemeColorHexByName('ut-gray'), []);
    const previewColor = isValidHexColor(`#${hexCode}`) ? `#${hexCode}` : baseColor;
    const tagColor = pickFontColor(previewColor.slice(1) as `#${string}`);

    const [localHexCode, setLocalHexCode] = React.useState(hexCode);
    const debouncedSetHexCode = useDebounce(setHexCode, 500);

    React.useEffect(() => {
        setLocalHexCode(hexCode);
    }, [hexCode]);

    React.useEffect(() => {
        debouncedSetHexCode(localHexCode);

        // This is on purpose
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [localHexCode]);

    return (
        <>
            <div
                style={{ backgroundColor: previewColor }}
                className='h-6.5 w-6.5 flex items-center justify-center rounded-l-1'
            >
                <Hash className={clsx('h-5 w-5 text-color-white', tagColor)} />
            </div>
            <div className='h-6.5 w-[53px] flex flex-1 items-center justify-center border-b border-r border-t rounded-br rounded-tr p-1.25'>
                <input
                    type='text'
                    maxLength={6}
                    className='w-full border-none bg-transparent font-size-2.75 font-normal font-mono outline-none focus:outline-none'
                    value={localHexCode}
                    onChange={e => setLocalHexCode(e.target.value)}
                />
            </div>
        </>
    );
}
