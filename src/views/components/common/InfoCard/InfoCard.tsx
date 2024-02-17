import React from 'react';
import Text from '../Text/Text';

interface Props {
    titleText: string;
    bodyText: string;
}

/**
 * A maybe reusable InfoCard component that follows the design system of the extension.
 * @returns
 */
export function InfoCard({
    titleText,
    bodyText
}: React.PropsWithChildren<Props>): JSX.Element {
    return (
        <div
            className = 'w-50 flex flex-col items-start justify-center border rounded p-4'  
            style = {{
                border: "1px solid #D6D2C4",
                background: "#FFF" //   White
            }}>
                <div className="flex flex-col items-start self-stretch gap-1.5">
                    <Text variant = "h4" as = 'span'
                        style = {{
                            color: '#F8971F', //    Orange
                        }}> 
                        {titleText} 
                    </Text>
                    <Text variant = "small" as = 'span'
                        style = {{
                            color: '#333F48', //    Black
                        }}> 
                        {bodyText} 
                    </Text>
                </ div>
        </div>
    );
}
