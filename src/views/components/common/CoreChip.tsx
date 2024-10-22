import Text from '@views/components/common/Text/Text';
import React from 'react';

/**
 * A type that represents the core curriculum aspects that a course can satisfy.
 */
export type Core = 'ID' | 'C1' | 'HU' | 'GO' | 'HI' | 'SB' | 'MA' | 'N1' | 'N2' | 'VP';
export const coreMap = {
    'First-Year Signature Course': 'ID',
    'English Composition': 'C1',
    Humanities: 'HU',
    'American and Texas Government': 'GO',
    'U.S. History': 'HI',
    'Social and Behavioral Sciences': 'SB',
    'Natural Science and Technology, Part I': 'N1',
    'Natural Science and Technology, Part II': 'N2',
    Mathematics: 'MA',
    'Visual and Performing Arts': 'VP',
} as const satisfies Record<string, Core>;

interface Props {
    label: Core;
}

/**
 * A reusable chip component for core curriculum satisfying courses that follows the design system of the extension.
 * @returns
 */
export function CoreChip({ label }: React.PropsWithChildren<Props>): JSX.Element {
    const coreName = Object.entries(coreMap).find(([full, short]) => short === label)?.[0] ?? label;

    return (
        <Text
            as='div'
            variant='h4'
            className='min-w-5 inline-flex items-center justify-center gap-2.5 rounded-lg px-1.5 py-0.5 text-center'
            style={{
                backgroundColor: '#005F86',
                color: '#FFFFFF',
            }}
            title={`[CORE CURRICULUM]: ${coreName}`}
        >
            {label}
        </Text>
    );
}
