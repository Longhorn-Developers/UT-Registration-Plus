import React from 'react';
import { Course } from 'src/shared/types/Course';
import Panel from '../../common/Panel/Panel';
import styles from './CoursePanel.module.scss';

interface Props {
    course: Course;
    onClose: () => void;
}

export default function CoursePanel({ course, onClose }: Props) {
    return (
        <Panel overlay>
            <div className={styles.coursePanelHeader} id='coursePanelHeader'>
                <div onClick={onClose} className={styles.closePanelButton}>
                    &#x2715;
                </div>
            </div>

            <div className={styles.panelBody}>
                <div className={styles.courseTitle}>{course.courseName}</div>
                <div className={styles.courseDescription}>{course.uniqueId}</div>
            </div>
        </Panel>
    );
}
