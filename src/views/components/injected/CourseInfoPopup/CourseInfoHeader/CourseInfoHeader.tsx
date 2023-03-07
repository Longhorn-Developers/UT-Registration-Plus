import React from 'react';
import { bMessenger } from 'src/shared/messages';
import { Course } from 'src/shared/types/Course';
import Card from 'src/views/components/common/Card/Card';
import Link from 'src/views/components/common/Link/Link';
import Text from 'src/views/components/common/Text/Text';
import styles from './CourseInfoHeader.module.scss';

type Props = {
    course: Course;
};

/**
 * This component displays the header of the course info popup.
 * It displays the course name, unique id, instructors, and schedule, all formatted nicely.
 */
export default function CourseInfoHeader({ course }: Props) {
    const getBuildingUrl = (building?: string): string | undefined => {
        if (!building) return undefined;
        return `https://utdirect.utexas.edu/apps/campus/buildings/nlogon/maps/UTM/${building}/`;
    };

    return (
        <Card className={styles.header}>
            <Text className={styles.title} size='large' weight='bold' color='black'>
                {course.courseName} ({course.department} {course.number})
                <Link
                    span
                    url={course.url}
                    className={styles.uniqueId}
                    size='medium'
                    weight='semi_bold'
                    color='burnt_orange'
                >
                    #{course.uniqueId}
                </Link>
            </Text>
            <Text size='medium' className={styles.instructors}>
                {course.getInstructorString({
                    prefix: 'with ',
                    format: 'first_last',
                })}
            </Text>

            {course.schedule.meetings.map(meeting => (
                <Text size='medium'>
                    <Text span size='medium' weight='bold' color='black'>
                        {meeting.getDaysString({
                            format: 'long',
                            separator: 'short',
                        })}
                    </Text>
                    {' at '}
                    <Text span size='medium'>
                        {meeting.getTimeString({
                            separator: 'to',
                            capitalize: true,
                        })}
                    </Text>
                    {' in '}
                    <Link
                        span
                        size='medium'
                        weight='normal'
                        color='bluebonnet'
                        url={getBuildingUrl(meeting.location?.building)}
                        disabled={!meeting.location?.building}
                    >
                        {meeting.location?.building ?? 'TBA'}
                    </Link>
                </Text>
            ))}
        </Card>
    );
}
