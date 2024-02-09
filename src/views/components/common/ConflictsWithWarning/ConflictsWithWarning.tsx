import React from 'react';
import Text from '../Text/Text';

/**
 * Props for PopupCourseBlock
 */
export interface ConflictsWithWarningProps {
    ConflictingCourse: string;
    SectionNumber: string;
}

/**
 * The "course block" to be used in the extension popup.
 *
 * @param props ConflictsWithWarningProps
 */
export default function ConflictsWithWarning( { ConflictingCourse, SectionNumber }: ConflictsWithWarningProps): JSX.Element {
    const UniqueCourseConflictText = `${ConflictingCourse} (${SectionNumber})`;

    return (
        <div className="flex w-21 min-w-21 p-2.5 flex-col items-start gap-2.5 rounded bg-[#AF2E2D]">
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
