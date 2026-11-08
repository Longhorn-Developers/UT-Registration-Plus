import clsx from 'clsx';
import type { JSX, SVGProps } from 'react';

interface LogoIconProps {
    className?: string;
}

/**
 * Renders the logo icon.
 *
 * @param props - The SVG props.
 * @returns The rendered logo icon.
 */
export function LogoIcon(props: SVGProps<SVGSVGElement>): JSX.Element {
    return (
        // biome-ignore lint/a11y/noSvgWithoutTitle: TODO:
        <svg width='40' height='40' viewBox='0 0 40 40' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
            <path
                fillRule='evenodd'
                clipRule='evenodd'
                fill='#BF5700'
                d='M20 0a20 20 0 1 0 0 40a20 20 0 1 0 0-40Z
   M20 3a17 17 0 1 1 0 34a17 17 0 1 1 0-34Z
   M20 6a14 14 0 1 0 0 28a14 14 0 1 0 0-28Z
   M18 10H22V18H29.5489V22H22V29.5489H18V22H10V18H18Z'
            />
        </svg>
    );
}

/**
 * Renders the small logo.
 *
 * @param className - The class name for the logo container.
 * @returns The rendered small logo.
 */
export function SmallLogo({ className }: LogoIconProps): JSX.Element {
    return (
        <div className={clsx('flex items-center gap-2', className)}>
            <LogoIcon />
            <div className='mt-1 flex flex-col text-lg font-medium leading-[1em]'>
                <p className='text-nowrap text-ut-burntorange dark:text-content'>UT Registration</p>
                <p className='text-ut-burntorange dark:text-content'>
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
 *
 * @param className - The class name for the logo container.
 * @returns The rendered large logo.
 */
export function LargeLogo({ className }: LogoIconProps): JSX.Element {
    return (
        <div className={clsx('flex items-center gap-spacing-3', className)}>
            <LogoIcon className='h-12 w-12' />
            <div className='mt-1 flex flex-col text-[1.35rem] font-medium leading-[1em] screenshot:flex'>
                <p className='text-nowrap text-ut-burntorange dark:text-content'>UT Registration</p>
                <p className='text-ut-burntorange dark:text-content'>
                    Plus{' '}
                    <span className='text-sm'>
                        {import.meta.env.VITE_BETA_BUILD ? `(${import.meta.env.VITE_PACKAGE_VERSION})` : ''}
                    </span>
                </p>
            </div>
        </div>
    );
}
