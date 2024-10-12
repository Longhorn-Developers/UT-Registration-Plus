import React from 'react';
import Text from '@views/components/common/Text/Text';

/**
 * Props for the Update Text
 */
export type UpdateTextProps = {
    courses: string[];
};

export default function UpdateText({ courses }: UpdateTextProps): JSX.Element {
    return (
        <div className='flex flex-col gap-2 justify-center max-w-64'>
            <div className='flex flex-col gap-0 text-center'>
                <Text variant='p' className='text-ut-burntorange'>
                    This extension has updated!
                </Text>
                <Text variant='p' className='text-ut-black'>
                    You may have already began planning your Spring 2025 schedule. Here are the Unique Numbers you had
                    from the old version: (Please open each link and re- add course to your new schedule)
                </Text>
            </div>
            <div className='flex flex-col gap-1 text-center'>
                {courses.map((course, index) => (
                    <Text key={index} variant='small' className='text-ut-orange'>
                        {course}
                    </Text>
                ))}
            </div>
        </div>
    );
}
