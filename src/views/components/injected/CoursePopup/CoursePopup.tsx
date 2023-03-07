import React from 'react';
import { Course } from 'src/shared/types/Course';
import Card from '../../common/Card/Card';
import Icon from '../../common/Icon/Icon';
import Link from '../../common/Link/Link';
import Popup from '../../common/Popup/Popup';
import Text from '../../common/Text/Text';
import styles from './CoursePopup.module.scss';

interface Props {
    course: Course;
    onClose: () => void;
}

/**
 * The popup that appears when the user clicks on a course for more details.
 */
export default function CoursePopup({ course, onClose }: Props) {
    console.log(course);
    return (
        <Popup className={styles.popup} overlay onClose={onClose}>
            <Icon className={styles.close} size='large' name='close' onClick={onClose} />
            <Card className={styles.body}>
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
                        <Link span size='medium' weight='bold' color='bluebonnet'>
                            {meeting.location?.building}
                        </Link>
                    </Text>
                ))}
            </Card>
        </Popup>
    );
}
