import type { Course } from '@shared/types/Course';
import Link from '@views/components/common/Link';
import Text from '@views/components/common/Text/Text';
import React from 'react';

interface LocationAndTimeProps {
    course: Course;
}

interface Meeting {
    days: string[];
    startTime: number;
    endTime: number;
    location?: {
        building: string;
        room: string;
    } | null;
}

/**
 * Renders a single meeting's time and location info.
 *
 * @param {Meeting} meeting - The meeting object.
 * @param {string} instructionMode - The mode of instruction (e.g., Online, In-person).
 * @returns {JSX.Element} The rendered meeting info.
 */
function MeetingInfoText({ meeting, instructionMode }: { meeting: Meeting; instructionMode: string }): JSX.Element {
    const daysString = meeting.days.join(' ');
    const timeString = `${meeting.startTime} to ${meeting.endTime}`;

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
        <Text key={`${daysString}-${timeString}`} variant='h4' as='p'>
            {daysString} {timeString} {locationInfo}
        </Text>
    );
}

/**
 * Render the time and location for the current class.
 *
 * @param {Course} props.course - The course object containing course details.
 * @returns {JSX.Element} The rendered component.
 */
export default function DisplayMeetingInfo({ course }: LocationAndTimeProps): JSX.Element {
    const { schedule, instructionMode } = course;

    const noMeetings = !Array.isArray(schedule.meetings) || schedule.meetings.length === 0;

    return (
        <div className='mt-1 flex flex-col'>
            {noMeetings ? (
                <Text variant='h4' as='p'>
                    {instructionMode !== 'Online'
                        ? 'No time and location has been provided.'
                        : 'No time has been provided.'}
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
