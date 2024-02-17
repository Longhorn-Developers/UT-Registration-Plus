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
        <div style = {{
            display: "flex",
            width: "200px",
            minWidth: "200px",
            maxWidth: "200px",
            padding: "15px",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            borderRadius: "4px",
            border: "1px solid #D6D2C4",
            background: "#FFF" //White
        }}>
            <div style = {{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "7px",
                alignSelf: "stretch",
            }}>
                <Text variant = "h4" as = 'span'
                    style = {{
                        color: '#F8971F', //Orange
                    }}> 
                    {titleText} 
                </Text>
                <Text variant = "small" as = 'span'
                    style = {{
                        color: '#333F48', //Black
                    }}> 
                    {bodyText} 
                </Text>
            </ div>
        </div>
    );
}
