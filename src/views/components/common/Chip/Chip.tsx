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
}

/**
 * A reusable chip component that follows the design system of the extension.
 * @returns
 */
export function Chip({ label }: React.PropsWithChildren<Props>): JSX.Element {
    return (
        <Text
            as='div'
            variant='h4'
            className='min-w-5 inline-flex items-center justify-center gap-2.5 rounded-lg px-1.5 py-0.5'
            style={{
                backgroundColor: '#FFD600',
            }}
            title={Object.entries(flagMap).find(([full, short]) => short === label)![0]}
        >
            {label}
        </Text>
    );
}
