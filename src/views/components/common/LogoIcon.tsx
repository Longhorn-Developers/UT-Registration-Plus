import type { SVGProps } from 'react';
import React from 'react';

export function LogoIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg width='40' height='40' viewBox='0 0 40 40' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <circle cx='20' cy='20' r='20' fill='#BF5700' />
            <circle cx='20' cy='20' r='15.5' stroke='white' strokeWidth='3' />
            <rect x='18' y='10' width='4' height='19.5489' fill='white' />
            <rect x='10' y='22' width='4' height='19.5489' transform='rotate(-90 10 22)' fill='white' />
        </svg>
    );
}
