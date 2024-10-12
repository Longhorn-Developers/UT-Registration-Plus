import Text from '@views/components/common/Text/Text';
import React from 'react';

/**
 * Props for the Update Text
 */
export type UpdateTextProps = {
    courses: string[];
};

export default function UpdateText({ courses }: UpdateTextProps): JSX.Element {
    return (
        <div className='max-w-64 flex flex-col justify-center gap-2'>
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
                    <Text key={course} variant='small' className='text-ut-orange underline'>
                        {course}
                    </Text>
                ))}
            </div>
        </div>
    );
}
