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
} as const;
type LoadStatusType = (typeof LoadStatus)[keyof typeof LoadStatus];

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

/**
 * Renders the description component.
 *
 * @component
 * @param {DescriptionProps} props - The component props.
 * @param {Course} props.course - The course for which to display the description.
 * @returns {JSX.Element} The rendered description component.
 */
const Description: React.FC<DescriptionProps> = ({ course }: DescriptionProps) => {
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
                <Text color='theme-red'>Please refresh the page and log back in using your UT EID and password</Text>
            )}
            {/* TODO (achadaga): would be nice to have a new spinner here */}
            {status === LoadStatus.LOADING && <Spinner />}
            {status === LoadStatus.DONE && (
                <ul className='my-[5px] space-y-1.5 children:marker:text-ut-burntorange'>
                    {description.map(line => {
                        const isKeywordPresent = keywords.some(keyword => line.toLowerCase().includes(keyword));
                        return (
                            <div key={line} className='flex gap-2'>
                                <span className='text-ut-burntorange'>•</span>
                                <li key={line}>
                                    <Text
                                        variant='p'
                                        className={clsx({ 'font-bold text-ut-burntorange': isKeywordPresent })}
                                    >
                                        {line}
                                    </Text>
                                </li>
                            </div>
                        );
                    })}
                </ul>
            )}
        </>
    );
};

export default Description;
