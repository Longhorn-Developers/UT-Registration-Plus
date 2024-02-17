import React from 'react';
import Text from '../Text/Text';

export const flags = ['WR', 'QR', 'GC', 'CD', 'E', 'II'];

interface Props {
    label: string;
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
            className='min-w-5 inline-flex items-center justify-center gap-2.5 rounded-lg px-1 py-0.5'
            style={{
                backgroundColor: '#FFD600',
            }}
        >
            {label}
        </Text>
    );
}
