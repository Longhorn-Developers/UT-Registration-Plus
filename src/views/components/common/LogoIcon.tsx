import clsx from 'clsx';
import type { SVGProps } from 'react';
import React from 'react';

/**
 * Renders the logo icon.
 * @param {SVGProps<SVGSVGElement>} props - The SVG props.
 * @returns {JSX.Element} The rendered logo icon.
 */
export function LogoIcon(props: SVGProps<SVGSVGElement>): JSX.Element {
    return (
        <svg width='40' height='40' viewBox='0 0 40 40' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
            <circle cx='20' cy='20' r='20' fill='#BF5700' />
            <circle cx='20' cy='20' r='15.5' stroke='white' strokeWidth='3' />
            <rect x='10' y='22' width='4' height='19.5489' transform='rotate(-90 10 22)' fill='white' />
        </svg>
    );
}

/**
 * Renders the small logo.
 * @param {Object} props - The component props.
 * @param {string} props.className - The class name for the logo container.
 * @returns {JSX.Element} The rendered small logo.
 */
export function SmallLogo({ className }: { className?: string }): JSX.Element {
    return (
        <div className={clsx('flex items-center gap-2', className)}>
            <LogoIcon />
            <div className='mt-1 flex flex-col text-lg font-medium leading-[1em]'>
                <p className='text-nowrap text-ut-burntorange'>UT Registration</p>
                <p className='text-ut-burntorange'>
                    Plus{' '}
                    <span className='text-xs'>
                        {import.meta.env.VITE_BETA_BUILD ? `(${import.meta.env.VITE_PACKAGE_VERSION})` : ''}
                    </span>
                </p>
            </div>
        </div>
    );
}

/**
 * Renders the large logo.
 * @param {Object} props - The component props.
 * @param {string} props.className - The class name for the logo container.
 * @returns {JSX.Element} The rendered large logo.
 */
export function LargeLogo({ className }: { className?: string }): JSX.Element {
    return (
        <div className={clsx('flex items-center gap-2', className)}>
            <LogoIcon className='h-12 w-12' />
            <div className='mt-1 hidden flex-col text-[1.35rem] font-medium leading-[1em] md:flex screenshot:flex'>
                <p className='text-nowrap text-ut-burntorange'>UT Registration</p>
                <p className='text-ut-burntorange'>
                    Plus{' '}
                    <span className='text-sm'>
                        {import.meta.env.VITE_BETA_BUILD ? `(${import.meta.env.VITE_PACKAGE_VERSION})` : ''}
                    </span>
                </p>
            </div>
        </div>
    );
}
