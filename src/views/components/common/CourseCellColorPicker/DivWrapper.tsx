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
 *
 * @param {ItemWrapperProps} props - the props for the component
 * @param {React.ReactNode} props.children - the children to be wrapped in the div
 * @returns {JSX.Element} - the div wrapper component
 */
const DivWrapper: React.FC<ItemWrapperProps> = ({ children }: ItemWrapperProps) => {
    return <div className='h-[26px] w-[26px] flex items-center justify-center p-[2px]'>{children}</div>;
};

export default DivWrapper;
