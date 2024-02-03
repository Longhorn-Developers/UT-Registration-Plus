import classNames from 'classnames';
import React from 'react';
import Text from '../Text/Text';
import styles from './Chip.module.scss';


export const flags = ["WR", "QR", "GC", "CD", "E", "II"]

interface Props {
    label: string;
}

/**
 * A reusable chip component that follows the design system of the extension.
 * @returns
 */
export function Chip({
    label
}: React.PropsWithChildren<Props>): JSX.Element {
    return (
        <Text as = {'div'} variant = 'h4'
            style = {{
                display: "inline-flex",
                minWidth: "21px",
                padding: "1px 4px",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
                borderRadius: "8px",
                background: "#FFD600", //Yellow
            }}>
            {label}
        </Text>
    );
}
