import Text from '@views/components/common/Text/Text';
import clsx from 'clsx';
import React from 'react';
import { Course } from 'src/shared/types/Course';
import { CourseCatalogScraper } from 'src/views/lib/CourseCatalogScraper';
import { SiteSupport } from 'src/views/lib/getSiteSupport';
import Spinner from '../../common/Spinner/Spinner';
import Text from '../../common/Text/Text';

interface DescriptionProps {
    course: Course;
}

enum LoadStatus {
    LOADING = 'LOADING',
    DONE = 'DONE',
    ERROR = 'ERROR',
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

/**
 * Renders the description component.
 *
 * @component
 * @param {DescriptionProps} props - The component props.
 * @param {string[]} props.lines - The lines of text to render.
 * @returns {JSX.Element} The rendered description component.
 */
const Description: React.FC<DescriptionProps> = ({ course }: DescriptionProps) => {
    const [description, setDescription] = React.useState<string[]>([]);
    const [status, setStatus] = React.useState<LoadStatus>(LoadStatus.LOADING);

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
                <Text color='speedway_brick'>
                    Please refresh the page and log back in using your UT EID and password
                </Text>
            )}
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
