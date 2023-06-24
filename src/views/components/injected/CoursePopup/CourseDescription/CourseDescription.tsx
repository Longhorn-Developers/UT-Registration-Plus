import { Course } from '@src/shared/types/Course';
import Spinner from '@src/views/components/common/Spinner/Spinner';
import Text from '@src/views/components/common/Text/Text';
import { CourseCatalogScraper } from '@src/views/lib/CourseCatalogScraper';
import { SiteSupport } from '@src/views/lib/getSiteSupport';
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import Card from '../../../common/Card/Card';
import styles from './CourseDescription.module.scss';

type Props = {
    course: Course;
};

enum LoadStatus {
    LOADING = 'LOADING',
    DONE = 'DONE',
    ERROR = 'ERROR',
}

/**
 *
 */
export default function CourseDescription({ course }: Props) {
    const [description, setDescription] = useState<string[]>([]);
    const [status, setStatus] = useState<LoadStatus>(LoadStatus.LOADING);

    useEffect(() => {
        fetchDescription(course)
            .then(description => {
                setStatus(LoadStatus.DONE);
                setDescription(description);
            })
            .catch(() => {
                setStatus(LoadStatus.ERROR);
            });
    }, [course]);

    return (
        <Card className={styles.container}>
            {status === LoadStatus.ERROR && (
                <Text color='speedway_brick' size='medium' weight='bold' align='center'>
                    Please refresh the page and log back in using your UT EID and password
                </Text>
            )}
            {status === LoadStatus.LOADING && <Spinner className={styles.spinner} />}
            {status === LoadStatus.DONE && (
                <ul className={styles.description}>
                    {description.map(paragraph => (
                        <li key={paragraph}>
                            <DescriptionLine line={paragraph} />
                        </li>
                    ))}
                </ul>
            )}
        </Card>
    );
}

interface LineProps {
    line: string;
}

function DescriptionLine({ line }: LineProps) {
    const lowerCaseLine = line.toLowerCase();

    const className = classNames({
        [styles.prerequisite]: lowerCaseLine.includes('prerequisite'),
        [styles.onlyOne]:
            lowerCaseLine.includes('may be') || lowerCaseLine.includes('only one') || lowerCaseLine.includes('may not'),
        [styles.restriction]: lowerCaseLine.includes('restrict'),
    });

    return (
        <Text className={className} size='medium'>
            {line}
        </Text>
    );
}

async function fetchDescription(course: Course): Promise<string[]> {
    if (!course.description?.length) {
        const response = await fetch(course.url);
        const text = await response.text();
        const doc = new DOMParser().parseFromString(text, 'text/html');

        const scraper = new CourseCatalogScraper(SiteSupport.COURSE_CATALOG_DETAILS);
        course.description = scraper.getDescription(doc);
    }
    return course.description;
}
