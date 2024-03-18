import Text from '@views/components/common/Text/Text';
import React from 'react';

/**
 * A type that represents the flags that a course can have.
 */
export type Flag = 'WR' | 'QR' | 'GC' | 'CD' | 'E' | 'II';
export const flagMap = {
    Writing: 'WR',
    'Quantitative Reasoning': 'QR',
    'Global Cultures': 'GC',
    'Cultural Diversity in the United States': 'CD',
    Ethics: 'E',
    'Independent Inquiry': 'II',
} as const satisfies Record<string, Flag>;

interface Props {
    label: Flag;
    tooltip: String;
}

/**
 * A reusable chip component that follows the design system of the extension.
 * @returns
 */

export function Chip({ label }: Props): JSX.Element {
    return (
        <div className='relative inline-block'>
            <span className='rounded-lg bg-yellow-500 px-2 py-1 text-white text-sm font-medium cursor-pointer'>
                {label}
            </span>
            {/* Tooltip */}
            <span className='absolute bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 pointer-events-none bottom-full left-1/2 transform -translate-x-1/2 transition-opacity duration-300 ease-in-out group-hover:opacity-100'>
                {label}
            </span>
        </div>
    );
}
