import type { SVGProps } from 'react';
import React from 'react';

/**
 * A simple spinner component that can be used to indicate loading.
 */
export default function Spinner({ className, ...rest }: SVGProps<SVGSVGElement>): JSX.Element {
    return (
        <div
            className={`will-change-transform animate-spin w-16 h-16 text-ut-orange ${className ?? ''}`}
            style={{ animationDuration: '225ms' }}
        >
            <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' {...rest}>
                <path
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                />
            </svg>
        </div>
    );
}
