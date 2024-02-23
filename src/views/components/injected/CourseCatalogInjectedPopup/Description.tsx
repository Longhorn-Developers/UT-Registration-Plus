import Text from '@views/components/common/Text/Text';
import clsx from 'clsx';
import React from 'react';

interface DescriptionProps {
    lines: string[];
}

/**
 * Renders the description component.
 *
 * @component
 * @param {DescriptionProps} props - The component props.
 * @param {string[]} props.lines - The lines of text to render.
 * @returns {JSX.Element} The rendered description component.
 */
const Description: React.FC<DescriptionProps> = ({ lines }: DescriptionProps) => {
    const keywords = ['prerequisite', 'restricted'];
    return (
        <ul className='my-[5px] space-y-1.5 children:marker:text-ut-burntorange'>
            {lines.map(line => {
                const isKeywordPresent = keywords.some(keyword => line.toLowerCase().includes(keyword));
                return (
                    <div className='flex gap-2'>
                        <span className='text-ut-burntorange'>•</span>
                        <li key={line}>
                            <Text variant='p' className={clsx({ 'font-bold text-ut-burntorange': isKeywordPresent })}>
                                {line}
                            </Text>
                        </li>
                    </div>
                );
            })}
        </ul>
    );
};

export default Description;
