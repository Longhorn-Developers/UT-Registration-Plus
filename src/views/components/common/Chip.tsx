import Text from '@views/components/common/Text/Text';
import clsx from 'clsx';
import React from 'react';

/**
 * A type that represents the flags that a course can have
 */
export type Flag = 'WR' | 'QR' | 'GC' | 'CD' | 'E' | 'II';
export const flagMap = {
    Writing: 'WR',
    'Quantitative Reasoning': 'QR',
    'Global Cultures': 'GC',
    'Cultural Diversity': 'CD',
    Ethics: 'E',
    'Independent Inquiry': 'II',
} as const satisfies Record<string, Flag>;

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

type Props =
    | {
          variant: 'core';
          label: Core;
      }
    | {
          variant: 'flag';
          label: Flag;
      };

/**
 * A reusable chip component that follows the design system of the extension.
 * @returns
 */
export function Chip({ variant, label }: React.PropsWithChildren<Props>): JSX.Element {
    let labelMap;
    switch (variant) {
        case 'core':
            labelMap = coreMap;
            break;
        case 'flag':
            labelMap = flagMap;
            break;
        default:
            labelMap = {};
    }
    const longName = Object.entries(labelMap).find(([_full, short]) => short === label)?.[0] ?? label;

    return (
        <Text
            as='div'
            variant='h4'
            className={clsx('min-w-5 inline-flex items-center justify-center gap-2.5 rounded-lg px-1.5 py-0.5', {
                'bg-ut-yellow text-black': variant === 'flag',
                'bg-ut-blue text-white': variant === 'core',
            })}
            title={variant === 'flag' ? `${longName} flag` : `${longName} core curriculum requirement`}
        >
            {label}
        </Text>
    );
}
