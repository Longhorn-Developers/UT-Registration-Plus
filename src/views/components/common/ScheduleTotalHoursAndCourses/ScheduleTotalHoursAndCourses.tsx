import React from 'react';
import Text from '../Text/Text';

/**
 * Props for ScheduleTotalHoursAndCourses
 */
export interface ScheduleTotalHoursAndCoursesProps {
    scheduleName: string;
    totalHours: number;
    totalCourses: number;
}

/**
 * The ScheduleTotalHoursAndCourses as per the Labels and Details Figma section
 *
 * @param props ScheduleTotalHoursAndCoursesProps
 */
export default function ScheduleTotalHoursAndCoursess({ scheduleName, totalHours, totalCourses }: ScheduleTotalHoursAndCoursesProps): JSX.Element {
    return (
        <div className="flex min-w-64 content-center gap-2 flex-wrap uppercase items-baseline">
            <Text
                className="text-[#BF5700]"
                variant='h1'
                as='span'
            >
                {`${scheduleName}: `}
            </Text>
            <Text
                variant='h3'
                as='div'
                className="text-[#1A2024] flex flex-row gap-2 items-center"
            >
                {`${totalHours} HOURS`}
                <Text
                    variant='h4'
                    as='span'
                    className="text-[#333F48]"
                >
                    {`${totalCourses} courses`}
                </Text>
            </Text>
        </div>
    );
}
