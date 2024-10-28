import type { Course } from '@shared/types/Course';
import type { CourseMeeting } from '@shared/types/CourseMeeting';
import Link from '@views/components/common/Link';
import Text from '@views/components/common/Text/Text';
import React from 'react';

export interface DisplayMeetingInfoProps {
    course: Course;
}

interface MeetingInfoTextProps {
    meeting: CourseMeeting;
    instructionMode: string;
}

/**
 * Renders a single meeting's time and location info.
 */
function MeetingInfoText({ meeting, instructionMode }: MeetingInfoTextProps): JSX.Element {
    const daysString = meeting.getDaysString({ format: 'long', separator: 'long' });
    const timeString = meeting.getTimeString({ separator: ' to ', capitalize: false });

    const getBuildingUrl = (building: string) =>
        `https://utdirect.utexas.edu/apps/campus/buildings/nlogon/maps/UTM/${building}`;

    let locationInfo: JSX.Element | string | undefined;

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
    } else if (instructionMode === 'Online') {
        locationInfo = 'Online (Internet)';
    }

    return (
        <Text variant='h4' as='p'>
            {daysString} {timeString}
            {locationInfo && <> {locationInfo}</>}
        </Text>
    );
}

/**
 * Render the time and location for the current class.
 */
export default function DisplayMeetingInfo({ course }: DisplayMeetingInfoProps): JSX.Element {
    const { schedule, instructionMode } = course;

    const noMeetings = !Array.isArray(schedule.meetings) || schedule.meetings.length === 0;

    return (
        <div className='mt-1 flex flex-col'>
            {noMeetings ? (
                <Text variant='h4' as='p'>
                    {instructionMode !== 'Online'
                        ? '(No time and location has been provided)'
                        : '(No time has been provided)'}
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
