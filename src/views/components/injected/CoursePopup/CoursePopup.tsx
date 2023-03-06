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
    return (
        <Popup className={styles.popup} overlay>
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
                
            </Card>
        </Popup>
    );
}
