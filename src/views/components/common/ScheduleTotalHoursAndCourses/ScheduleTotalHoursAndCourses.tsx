import clsx from 'clsx';
import React, { useState } from 'react';
import { Course, Status } from '@shared/types/Course';
import { StatusIcon } from '@shared/util/icons';
import { CourseColors, getCourseColors, pickFontColor } from '@shared/util/colors';
import DragIndicatorIcon from '~icons/material-symbols/drag-indicator';
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
        <div
            style={{
                display: 'flex',
                minWidth: '245px',
                alignItems: 'center',
                alignContent: 'center',
                gap: '5px 10px',
                flexWrap: 'wrap',
            }}
        >
            <Text
                style={{
                    color: '#BF5700',
                }}
                variant='h1'
                as='span'
            >
                {`${scheduleName}: `}
            </Text>
            <Text
                variant='h3'
                as='span'
                style={{
                    color: '#1A2024'
                }}
            >
                {`${totalHours} HOURS`}
            </Text>
            <Text
                variant='h4'
                as='span'
                style={{
                    color: '#333F48'
                }}
            >
                {`${totalCourses} courses`}
            </Text>
        </div>
    );
}
