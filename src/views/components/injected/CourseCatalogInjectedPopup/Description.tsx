import type { Course } from '@shared/types/Course';
import Spinner from '@views/components/common/Spinner/Spinner';
import Text from '@views/components/common/Text/Text';
import { CourseCatalogScraper } from '@views/lib/CourseCatalogScraper';
import { SiteSupport } from '@views/lib/getSiteSupport';
import clsx from 'clsx';
import React from 'react';

interface DescriptionProps {
    course: Course;
}

const LoadStatus = {
    LOADING: 'LOADING',
    DONE: 'DONE',
    ERROR: 'ERROR',
} as const satisfies Record<string, string>;
type LoadStatusType = (typeof LoadStatus)[keyof typeof LoadStatus];

const fetchDescription = async (course: Course): Promise<string[]> => {
    if (!course.description?.length) {
        const response = await fetch(course.url);
        const text = await response.text();
        const doc = new DOMParser().parseFromString(text, 'text/html');

        const scraper = new CourseCatalogScraper(SiteSupport.COURSE_CATALOG_DETAILS);
        course.description = scraper.getDescription(doc);
    }
    return course.description;
};

/**
 * Renders the description component.
 *
 * @component
 * @param {DescriptionProps} props - The component props.
 * @param {Course} props.course - The course for which to display the description.
 * @returns {JSX.Element} The rendered description component.
 */
export default function Description({ course }: DescriptionProps): JSX.Element {
    const [description, setDescription] = React.useState<string[]>([]);
    const [status, setStatus] = React.useState<LoadStatusType>(LoadStatus.LOADING);

    React.useEffect(() => {
        fetchDescription(course)
            .then(description => {
                setStatus(LoadStatus.DONE);
                setDescription(description);
            })
            .catch(() => {
                setStatus(LoadStatus.ERROR);
            });
    }, [course]);

    const keywords = ['prerequisite', 'restricted'];
    return (
        <>
            {status === LoadStatus.ERROR && (
                <Text className='text-theme-red font-bold!'>
                    Please refresh the page and log back in using your UT EID and password.
                </Text>
            )}
            {/* TODO (achadaga): would be nice to have a new spinner here */}
            {status === LoadStatus.LOADING && <Spinner />}
            {status === LoadStatus.DONE && (
                <ul className='ml-6 mt-1.5 list-disc list-outside space-y-1.5'>
                    {description.map(line => {
                        const isKeywordPresent = keywords.some(keyword => line.toLowerCase().includes(keyword));
                        return (
                            <li
                                key={line}
                                className={clsx({
                                    'children:font-bold! text-ut-burntorange marker:text-ut-burntorange':
                                        isKeywordPresent,
                                })}
                            >
                                <Text variant='p'>{line}</Text>
                            </li>
                        );
                    })}
                </ul>
            )}
        </>
    );
}
