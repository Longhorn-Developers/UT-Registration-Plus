import clsx from 'clsx';
import React from 'react';
import Text from '../../common/Text/Text';

interface CoursePopupDescriptionsProps {
    lines: string[];
}

const CoursePopupDescriptions: React.FC<CoursePopupDescriptionsProps> = ({ lines }: CoursePopupDescriptionsProps) => {
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

export default CoursePopupDescriptions;
