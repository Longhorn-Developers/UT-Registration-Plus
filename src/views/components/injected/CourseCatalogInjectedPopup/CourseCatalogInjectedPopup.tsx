import flagIcon from '@assets/flag.svg';
import { ArrowUpRight } from '@phosphor-icons/react';
import type { Course } from '@shared/types/Course';
import type { DialogProps } from '@views/components/common/Dialog';
import Dialog from '@views/components/common/Dialog';
import Text from '@views/components/common/Text/Text';
import useReportIssueDialog from '@views/hooks/useReportIssueDialog';
import useSchedules from '@views/hooks/useSchedules';
import React from 'react';

import Description from './Description';
import GradeDistribution from './GradeDistribution';
import HeadingAndActions from './HeadingAndActions';

/**
 * Props for the CourseCatalogInjectedPopup component.
 */
export interface CourseCatalogInjectedPopupProps extends DialogProps {
    course: Course;
}

/**
 * CourseCatalogInjectedPopup component displays a popup with course details.
 *
 * @param course - The course object containing course details.
 * @param activeSchedule - The active schedule object.
 * @param onClose - The function to close the popup.
 * @returns The CourseCatalogInjectedPopup component.
 */
function CourseCatalogInjectedPopup({ course, ...rest }: CourseCatalogInjectedPopupProps): JSX.Element {
    const emptyRef = React.useRef<HTMLDivElement>(null);
    const [activeSchedule] = useSchedules();
    const showReportIssueDialog = useReportIssueDialog();

    return (
        <Dialog className='max-w-[780px] overflow-y-hidden px-4' {...rest} initialFocus={emptyRef}>
            <div className='hidden' ref={emptyRef} />
            <HeadingAndActions course={course} onClose={rest.onClose as () => void} activeSchedule={activeSchedule} />
            <div className='overflow-y-auto px-2'>
                <Description course={course} />
                <GradeDistribution course={course} />
                <div className='mb-2 mt-2 flex justify-end'>
                    <button
                        type='button'
                        className='btn h-8 border-none bg-transparent px-spacing-3 text-ut-burntorange hover:bg-ut-burntorange/8'
                        onClick={showReportIssueDialog}
                    >
                        <div className='flex items-center gap-1.5'>
                            <img src={flagIcon} alt='' aria-hidden='true' className='h-4 w-4' />
                            <Text variant='small' className='text-ut-burntorange'>
                                Send us Feedback!
                            </Text>
                            <ArrowUpRight className='h-4 w-4 text-ut-burntorange' />
                        </div>
                    </button>
                </div>
            </div>
        </Dialog>
    );
}

export default React.memo(CourseCatalogInjectedPopup);
