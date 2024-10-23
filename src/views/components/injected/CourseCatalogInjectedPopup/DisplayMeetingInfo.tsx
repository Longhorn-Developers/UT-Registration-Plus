import type { Course } from '@shared/types/Course';
import type { CourseMeeting } from '@shared/types/CourseMeeting';
import Link from '@views/components/common/Link';
import Text from '@views/components/common/Text/Text';
import React from 'react';

interface LocationAndTimeProps {
    course: Course;
}

interface MeetingInfoTextProp {
    meeting: CourseMeeting;
    instructionMode: string;
}

/**
 * Renders a single meeting's time and location info.
 *
 * @param meeting - The meeting object.
 * @param instructionMode - The mode of instruction (e.g., Online, In-person).
 * @returns The rendered meeting info.
 */
function MeetingInfoText({ meeting, instructionMode }: MeetingInfoTextProp): JSX.Element {
    const daysString = meeting.getDaysString({ format: 'long', separator: 'long' });
    const timeString = meeting.getTimeString({ separator: ' to ', capitalize: false });

    const getBuildingUrl = (building: string) =>
        `https://utdirect.utexas.edu/apps/campus/buildings/nlogon/maps/UTM/${building}`;

    let locationInfo: string | JSX.Element = '';

    if (meeting.location) {
        locationInfo = (
            <>
                {'in '}
                <Link href={getBuildingUrl(meeting.location.building)} className='link' variant='h4'>
                    {meeting.location.building} {meeting.location.room}
                </Link>
            </>
        );
    } else if (instructionMode !== 'Online') {
        locationInfo = '(No location has been provided)';
    }

    return (
        <Text variant='h4' as='p'>
            {daysString} {timeString} {locationInfo}
        </Text>
    );
}

/**
 * Render the time and location for the current class.
 *
 * @param props.course - The course object containing course details.
 * @returns  The rendered component.
 */
export default function DisplayMeetingInfo({ course }: LocationAndTimeProps): JSX.Element {
    const { schedule, instructionMode } = course;

    const noMeetings = !Array.isArray(schedule.meetings) || schedule.meetings.length === 0;

    return (
        <div className='mt-1 flex flex-col'>
            {noMeetings ? (
                <Text variant='h4' as='p'>
                    {instructionMode !== 'Online'
                        ? '(No time and location has been provided.)'
                        : '(No time has been provided.)'}
                </Text>
            ) : (
                schedule.meetings.map(meeting => (
                    <MeetingInfoText
                        key={`${meeting.days.join('-')}-${meeting.startTime}-${meeting.endTime}`}
                        meeting={meeting}
                        instructionMode={instructionMode}
                    />
                ))
            )}
        </div>
    );
}
