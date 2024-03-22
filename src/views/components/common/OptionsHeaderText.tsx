import Text from '@views/components/common/Text/Text';
import React from 'react';

/**
 * Props for ScheduleTotalHoursAndCourses
 */
export interface OptionsTextProps {
    optionsPageName: string;
}

/**
 * The ScheduleTotalHoursAndCourses as per the Labels and Details Figma section
 *
 * @param props ScheduleTotalHoursAndCoursesProps
 */
export default function OptionsText({ optionsPageName }: OptionsTextProps): JSX.Element {
    return (
        <div className='min-w-full w-0 flex items-center gap-2.5 whitespace-nowrap'>
            <Text className='truncate text-ut-burntorange uppercase' variant='h1' as='span'>
                {`${optionsPageName}`}
            </Text>
        </div>
    );
}
