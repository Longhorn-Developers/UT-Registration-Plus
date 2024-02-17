import React from 'react';
import Text from '../Text/Text';

/**
 * Props for ConflictWithWarningProps
 */
export interface ConflictsWithWarningProps {
    ConflictingCourse: string;
    SectionNumber: string;
}

/**
 * The ConflictsWithWarning component is used to display a warning message when a course conflicts 
 * with another course as part of the labels and details section
 *
 * @param props ConflictsWithWarningProps
 */
export default function ConflictsWithWarning( { ConflictingCourse, SectionNumber }: ConflictsWithWarningProps): JSX.Element {
    const UniqueCourseConflictText = `${ConflictingCourse} (${SectionNumber})`;

    return (
        <div className="min-w-21 w-21 flex flex-col items-start gap-2.5 rounded bg-[#AF2E2D] p-2.5">
            <ConflictsWithoutWarningText>
               Conflicts With:
            </ConflictsWithoutWarningText>
            <ConflictsWithoutWarningText>
                {UniqueCourseConflictText}
            </ConflictsWithoutWarningText>
        </div>
    );
}

function ConflictsWithoutWarningText( {children}: {children: string} ) {
    return (
        <Text
            variant='mini'
            as='span'
            className='text-white'
        >
            {children}
        </Text>
    );
}
