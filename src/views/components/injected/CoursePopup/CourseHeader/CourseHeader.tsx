import React from 'react';
import { Course } from 'src/shared/types/Course';
import Card from 'src/views/components/common/Card/Card';
import Icon from 'src/views/components/common/Icon/Icon';
import Link from 'src/views/components/common/Link/Link';
import Text from 'src/views/components/common/Text/Text';
import CourseButtons from './CourseButtons/CourseButtons';
import styles from './CourseHeader.module.scss';

type Props = {
    course: Course;
    onClose: () => void;
};

/**
 * This component displays the header of the course info popup.
 * It displays the course name, unique id, instructors, and schedule, all formatted nicely.
 */
export default function CourseHeader({ course, onClose }: Props) {
    const getBuildingUrl = (building?: string): string | undefined => {
        if (!building) return undefined;
        return `https://utdirect.utexas.edu/apps/campus/buildings/nlogon/maps/UTM/${building}/`;
    };

    return (
        <Card className={styles.header}>
            <Icon className={styles.close} size='large' name='close' onClick={onClose} />
            <Text className={styles.title} size='medium' weight='bold' color='black'>
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
                {`with ${!course.instructors.length ? 'TBA' : ''}`}
                {course.instructors.map((instructor, index) => {
                    const name = instructor.toString({
                        format: 'first_last',
                        case: 'capitalize',
                    });

                    const url = instructor.getDirectoryUrl();
                    const numInstructors = course.instructors.length;
                    const isLast = course.instructors.length > 1 && index === course.instructors.length - 1;
                    return (
                        <>
                            {numInstructors > 1 && index === course.instructors.length - 1 ? '& ' : ''}
                            <Link key={name} span size='medium' weight='normal' url={url}>
                                {name}
                            </Link>
                            {numInstructors > 2 && !isLast ? ', ' : ''}
                        </>
                    );
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
                        url={getBuildingUrl(meeting.location?.building)}
                        disabled={!meeting.location?.building}
                    >
                        {meeting.location?.building ?? 'TBA'}
                    </Link>
                </Text>
            ))}

            <CourseButtons course={course} />
        </Card>
    );
}
