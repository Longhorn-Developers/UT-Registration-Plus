import React from 'react';
import { bMessenger } from 'src/shared/messages';
import { Course } from 'src/shared/types/Course';
import { Button } from 'src/views/components/common/Button/Button';
import Card from 'src/views/components/common/Card/Card';
import Icon from 'src/views/components/common/Icon/Icon';
import Link from 'src/views/components/common/Link/Link';
import Text from 'src/views/components/common/Text/Text';
import styles from './CourseInfoHeader.module.scss';

type Props = {
    course: Course;
    onClose: () => void;
};

/**
 * This component displays the header of the course info popup.
 * It displays the course name, unique id, instructors, and schedule, all formatted nicely.
 */
export default function CourseInfoHeader({ course, onClose }: Props) {
    const getBuildingUrl = (building?: string): string | undefined => {
        if (!building) return undefined;
        return `https://utdirect.utexas.edu/apps/campus/buildings/nlogon/maps/UTM/${building}/`;
    };

    const openRateMyProfessorURL = () => {
        const name = course.getInstructorString({
            format: 'first_last',
            max: 1,
        });

        const url = new URL('https://www.ratemyprofessors.com/search.jsp');
        url.searchParams.append('queryBy', 'teacherName');
        url.searchParams.append('schoolName', 'university of texas at austin');
        url.searchParams.append('queryoption', 'HEADER');
        url.searchParams.append('query', name);
        url.searchParams.append('facetSearch', 'true');

        bMessenger.openNewTab({ url: url.toString() });
    };

    const openECISURL = () => {
        // TODO: Figure out how to get the ECIS URL, the old one doesn't work anymore
        // http://utdirect.utexas.edu/ctl/ecis/results/index.WBX?&s_in_action_sw=S&s_in_search_type_sw=N&s_in_search_name=${prof_name}%2C%20${first_name}
        // const name = course.getInstructorString({
    };

    const openSyllabiURL = () => {
        // https://utdirect.utexas.edu/apps/student/coursedocs/nlogon/?year=&semester=&department=${department}&course_number=${number}&course_title=&unique=&instructor_first=&instructor_last=${prof_name}&course_type=In+Residence&search=Search
        const { department, number } = course;

        const { firstName, lastName } = course.instructors?.[0] ?? {};

        const url = new URL('https://utdirect.utexas.edu/apps/student/coursedocs/nlogon/');
        url.searchParams.append('department', department);
        url.searchParams.append('course_number', number);
        url.searchParams.append('instructor_first', firstName ?? '');
        url.searchParams.append('instructor_last', lastName ?? '');
        url.searchParams.append('course_type', 'In Residence');
        url.searchParams.append('search', 'Search');

        bMessenger.openNewTab({ url: url.toString() });
    };

    return (
        <Card className={styles.header}>
            <Icon className={styles.close} size='large' name='close' onClick={onClose} />
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

            <Card className={styles.buttonContainer}>
                <Button
                    disabled={!course.instructors.length}
                    type='primary'
                    className={styles.button}
                    onClick={openRateMyProfessorURL}
                >
                    <Text size='medium' weight='regular' color='white'>
                        RateMyProf
                    </Text>
                    <Icon className={styles.icon} color='white' name='school' size='medium' />
                </Button>
                <Button type='secondary' className={styles.button} onClick={openSyllabiURL}>
                    <Text size='medium' weight='regular' color='white'>
                        Syllabi
                    </Text>
                    <Icon className={styles.icon} color='white' name='grading' size='medium' />
                </Button>
                <Button type='tertiary' className={styles.button}>
                    <Text size='medium' weight='regular' color='white'>
                        Textbook
                    </Text>
                    <Icon className={styles.icon} color='white' name='collections_bookmark' size='medium' />
                </Button>
                <Button type='success' className={styles.button}>
                    <Text size='medium' weight='regular' color='white'>
                        Save
                    </Text>
                    <Icon className={styles.icon} color='white' name='add' size='medium' />
                </Button>
            </Card>
        </Card>
    );
}
