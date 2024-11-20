import Text from '@views/components/common/Text/Text';
import React from 'react';

/**
 * Props for the Update Text
 */
export type UpdateTextProps = {
    courses: string[];
};

/**
 * UpdateText component displays a message indicating that the extension has been updated
 * and lists the unique course numbers from the old version.
 *
 * @param courses - An array of course unique numbers to be displayed.
 * @returns The rendered UpdateText component.
 */
export default function UpdateText({ courses }: UpdateTextProps): JSX.Element {
    return (
        <div className='max-w-64 flex flex-col justify-center gap-2'>
            <div className='flex flex-col gap-0 text-center'>
                <Text variant='h4' className='text-ut-burntorange'>
                    This extension has updated!
                </Text>
                <Text variant='p' className='text-ut-black'>
                    You may have already began planning your Spring 2025 schedule. Here are the Unique Numbers you had
                    from the old version: (Please open each link and re-add course to your new schedule)
                </Text>
            </div>
            <div className='flex flex-col gap-1 text-center'>
                {courses.map(course => (
                    <Text key={course} variant='p' className='text-ut-orange underline'>
                        {course}
                    </Text>
                ))}
            </div>
        </div>
    );
}
