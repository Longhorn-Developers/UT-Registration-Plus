import React from 'react';
import { Course } from 'src/shared/types/Course';
import Card from '../../common/Card/Card';
import Icon from '../../common/Icon/Icon';
import Link from '../../common/Link/Link';
import Popup from '../../common/Popup/Popup';
import Text from '../../common/Text/Text';
import CourseInfoHeader from './CourseInfoHeader/CourseInfoHeader';
import styles from './CourseInfoPopup.module.scss';

interface Props {
    course: Course;
    onClose: () => void;
}

/**
 * The popup that appears when the user clicks on a course for more details.
 */
export default function CourseInfoPopup({ course, onClose }: Props) {
    console.log(course);
    return (
        <Popup className={styles.popup} overlay onClose={onClose}>
            <Icon className={styles.close} size='large' name='close' onClick={onClose} />
            <CourseInfoHeader course={course} />
        </Popup>
    );
}
