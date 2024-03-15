import React from 'react';

/**
 * Props for the DivWrapper component
 */
interface ItemWrapperProps {
    children: React.ReactNode;
}

/**
 * Utility component to space all the color patches in the color picker component
 *
 * @param {ItemWrapperProps} props - the props for the component
 * @param {React.ReactNode} props.children - the children to be wrapped in the div
 * @returns {JSX.Element} - the div wrapper component
 */
export default function DivWrapper({ children }: ItemWrapperProps): JSX.Element {
    return <div className='h-6.5 w-6.5 flex items-center justify-center p-0.5'>{children}</div>;
}
