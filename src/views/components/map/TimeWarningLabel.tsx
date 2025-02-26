import React from 'react';

interface TimeWarningLabelProps {
    x: number;
    y: number;
    minutes: number;
}

/**
 * TimeWarningLabel component that renders a warning label on a map.
 * The label consists of a circle with a text inside it, indicating the number of minutes.
 *
 * @param x - The x-coordinate for the center of the circle.
 * @param y - The y-coordinate for the center of the circle.
 * @param minutes - The number of minutes to display inside the circle.
 *
 * @returns A JSX element representing the warning label.
 */
export default function TimeWarningLabel({ x, y, minutes }: TimeWarningLabelProps): JSX.Element {
    return (
        <g>
            <circle cx={x} cy={y} r={12} fill='white' stroke='#FF4444' strokeWidth={2} />
            <text
                x={x}
                y={y}
                textAnchor='middle'
                dominantBaseline='middle'
                fill='#FF4444'
                fontSize='10'
                fontWeight='bold'
            >
                {minutes}&apos;
            </text>
        </g>
    );
}
