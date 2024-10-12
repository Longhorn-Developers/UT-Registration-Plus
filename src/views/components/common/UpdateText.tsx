import React from 'react';
import Text from '@views/components/common/Text/Text';

/**
 * Props for the Update Text
 */
export type DividerProps = {
    courses: string[];
};

export default function UpdateText({ courses }: DividerProps): JSX.Element {
    return (
        <div>
            <div className='flex flex-col gap-0'>
                <Text variant='small' className='text-ut-orange'>
                    This extension has updated!
                </Text>
                <Text variant='small' className='text-ut-black'>
                    You may have already began planning your Spring 2025 schedule. Here are the Unique Numbers you had
                    from the old version: (Please open each link and re- add course to your new schedule)
                </Text>
            </div>
            <div>
                {courses.map((course, index) => (
                    <Text key={index} variant='small' className='text-ut-orange'>
                        {course}
                    </Text>
                ))}
            </div>
        </div>
    );
}
