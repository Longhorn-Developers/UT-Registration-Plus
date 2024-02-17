import { Course } from '@shared/types/Course';
import { UserSchedule } from '@shared/types/UserSchedule';
import React from 'react';
import Card from '@views/components/common/Card/Card';
import Icon from '@views/components/common/Icon/Icon';
import Link from '@views/components/common/Link/Link';
import Text from '@views/components/common/Text/Text';
//  import CourseButtons from './CourseButtons/CourseButtons';
import styles from './CourseHeader.module.scss';

type Props = {
    course: Course;
    activeSchedule?: UserSchedule;
    onClose: () => void;
};

/**
 * This component displays the header of the course info popup.
 * It displays the course name, unique id, instructors, and schedule, all formatted nicely.
 */
export default function CourseHeader({ course, activeSchedule, onClose }: Props) {
    const getBuildingUrl = (building?: string): string | undefined => {
        if (!building) return undefined;
        return `https://utdirect.utexas.edu/apps/campus/buildings/nlogon/maps/UTM/${building}/`;
    };

    return (
        <Card className={styles.header}>
            <Icon className={styles.close}  /*  size='large'    */ name='close' onClick={onClose} />
            <div className={styles.title}>
                <Text className={styles.courseName} /* size='large' weight='bold' color='black' */>
                    {course.courseName} ({course.department} {course.number})
                </Text>
                <Link
                    url={course.url}
                    className={styles.uniqueId}
                    /* size='medium' 
                    weight='semi_bold' */
                    color='burnt_orange'
                    title='View course details on UT Course Schedule'
                >
                    #{course.uniqueId}
                </Link>
            </div>
            <Text /*    size='medium' className={styles.instructors}    */>
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
                        <span key={name}>
                            {numInstructors > 1 && index === course.instructors.length - 1 ? '& ' : ''}
                            <Link
                                key={name}
                                /*  size='medium'    
                                weight='normal' */
                                url={url}
                                title="View instructor's directory page"
                            >
                                {name}
                            </Link>
                            {numInstructors > 2 && !isLast ? ', ' : ''}
                        </span>
                    );
                })}
            </Text>
            {course.schedule.meetings.map(meeting => (
                <Text /*    size='medium'   */ className={styles.meeting} key={meeting.startTime}>
                    <Text as='span' /*  size='medium'    weight='bold'  */ color='black'>
                        {meeting.getDaysString({
                            format: 'long',
                            separator: 'short',
                        })}
                    </Text>
                    {' at '}
                    <Text as='span' /*  size='medium'  */>
                        {meeting.getTimeString({
                            separator: 'to',
                            capitalize: true,
                        })}
                    </Text>
                    {' in '}
                    <Link
                        /*  size='medium'
                        weight='normal' */
                        title='View building on UT Map'
                        url={getBuildingUrl(meeting.location?.building)}
                        disabled={!meeting.location?.building}
                    >
                        {meeting.location?.building ?? 'TBA'}
                    </Link>
                </Text>
            ))}

            {/* <CourseButtons course={course} activeSchedule={activeSchedule} />   */}
        </Card>
    );
}
