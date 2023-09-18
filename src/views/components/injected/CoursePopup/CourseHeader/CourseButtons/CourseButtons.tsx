import React from 'react';
import { bMessenger } from 'src/shared/messages';
import { Course } from 'src/shared/types/Course';
import { UserSchedule } from 'src/shared/types/UserSchedule';
import { Button } from 'src/views/components/common/Button/Button';
import Card from 'src/views/components/common/Card/Card';
import Icon from 'src/views/components/common/Icon/Icon';
import Text from 'src/views/components/common/Text/Text';
import styles from './CourseButtons.module.scss';

type Props = {
    activeSchedule?: UserSchedule;
    course: Course;
};

const { openNewTab, addCourse, removeCourse } = bMessenger;

/**
 * This component displays the buttons for the course info popup, that allow the user to either
 * navigate to other pages that are useful for the course, or to do actions on the current course.
 */
export default function CourseButtons({ course, activeSchedule }: Props) {
    const openRateMyProfessorURL = () => {
        const primaryInstructor = course.instructors?.[0];
        if (!primaryInstructor) return;

        const name = primaryInstructor.toString({
            format: 'first_last',
            case: 'capitalize',
        });

        const url = new URL('https://www.ratemyprofessors.com/search.jsp');
        url.searchParams.append('queryBy', 'teacherName');
        url.searchParams.append('schoolName', 'university of texas at austin');
        url.searchParams.append('queryoption', 'HEADER');
        url.searchParams.append('query', name);
        url.searchParams.append('facetSearch', 'true');

        openNewTab({ url: url.toString() });
    };

    const openSyllabiURL = () => {
        const { department, number } = course;

        const { firstName, lastName } = course.instructors?.[0] ?? {};

        const url = new URL('https://utdirect.utexas.edu/apps/student/coursedocs/nlogon/');
        url.searchParams.append('department', department);
        url.searchParams.append('course_number', number);
        url.searchParams.append('instructor_first', firstName ?? '');
        url.searchParams.append('instructor_last', lastName ?? '');
        url.searchParams.append('course_type', 'In Residence');
        url.searchParams.append('search', 'Search');

        openNewTab({ url: url.toString() });
    };

    const openTextbookURL = () => {
        const { department, number, semester, uniqueId } = course;
        const url = new URL('https://www.universitycoop.com/adoption-search-results');
        url.searchParams.append('sn', `${semester.code}__${department}__${number}__${uniqueId}`);

        openNewTab({ url: url.toString() });
    };

    const handleSaveCourse = async () => {
        if (!activeSchedule) return;
        addCourse({ course, scheduleName: activeSchedule.name });
    };

    const handleRemoveCourse = async () => {
        if (!activeSchedule) return;
        removeCourse({ course, scheduleName: activeSchedule.name });
    };

    const isCourseSaved = (() => {
        if (!activeSchedule) return false;
        return Boolean(activeSchedule.containsCourse(course));
    })();

    return (
        <Card className={styles.container}>
            <Button
                onClick={openRateMyProfessorURL}
                disabled={!course.instructors.length}
                type='primary'
                className={styles.button}
                title='Search for this professor on RateMyProfessor'
            >
                <Text size='medium' weight='regular' color='white'>
                    RateMyProf
                </Text>
                <Icon className={styles.icon} color='white' name='school' size='medium' />
            </Button>
            <Button
                onClick={openSyllabiURL}
                type='secondary'
                className={styles.button}
                title='Search for syllabi for this course'
            >
                <Text size='medium' weight='regular' color='white'>
                    Syllabi
                </Text>
                <Icon className={styles.icon} color='white' name='grading' size='medium' />
            </Button>
            <Button
                onClick={openTextbookURL}
                type='tertiary'
                className={styles.button}
                title='Search for textbooks for this course'
            >
                <Text size='medium' weight='regular' color='white'>
                    Textbook
                </Text>
                <Icon className={styles.icon} color='white' name='collections_bookmark' size='medium' />
            </Button>
            <Button
                disabled={!activeSchedule}
                onClick={isCourseSaved ? handleRemoveCourse : handleSaveCourse}
                title={isCourseSaved ? 'Remove this course from your schedule' : 'Add this course to your schedule'}
                type={isCourseSaved ? 'danger' : 'success'}
                className={styles.button}
            >
                <Text size='medium' weight='regular' color='white'>
                    {isCourseSaved ? 'Remove' : 'Add'}
                </Text>
                <Icon className={styles.icon} color='white' name={isCourseSaved ? 'remove' : 'add'} size='medium' />
            </Button>
        </Card>
    );
}
