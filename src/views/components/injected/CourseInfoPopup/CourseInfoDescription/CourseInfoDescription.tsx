import React, { useEffect } from 'react';
import { Course } from 'src/shared/types/Course';
import Text from 'src/views/components/common/Text/Text';
import { CourseCatalogScraper } from 'src/views/lib/CourseCatalogScraper';
import { SiteSupport } from 'src/views/lib/getSiteSupport';
import Card from '../../../common/Card/Card';
import styles from './CourseInfoDescription.module.scss';

type Props = {
    course: Course;
};

export default function CourseInfoDescription({ course }: Props) {
    const [description, setDescription] = React.useState<string[]>([]);

    useEffect(() => {
        fetchDescription(course).then(description => {
            setDescription(description);
        });
    }, [course]);

    if (!description.length) {
        return null;
    }

    return (
        <Card className={styles.descriptionContainer}>
            {description.map((paragraph, i) => (
                <Text size='medium'>{paragraph}</Text>
            ))}
        </Card>
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
