import type { Course } from '@shared/types/Course';
import type { CourseMeeting } from '@shared/types/CourseMeeting';
import Link from '@views/components/common/Link';
import Text from '@views/components/common/Text/Text';
import React from 'react';

/**
 * Props for the DisplayMeetingInfo component.
 */
export interface DisplayMeetingInfoProps {
    course: Course;
}

interface MeetingInfoTextProps {
    meeting: CourseMeeting;
    instructionMode: string;
}

/**
 * Renders a single meeting's time and location info.
 *
 * @param meeting - The meeting to display the info for.
 * @param instructionMode - The instruction mode of the course.
 * @returns The JSX element for the meeting info.
 */
function MeetingInfoText({ meeting, instructionMode }: MeetingInfoTextProps): JSX.Element {
    const daysString = meeting.getDaysString({ format: 'long', separator: 'long' });
    const timeString = meeting.getTimeString({ separator: ' to ' });

    const getBuildingUrl = (building: string) =>
        `https://utdirect.utexas.edu/apps/campus/buildings/nlogon/maps/UTM/${building}`;

    let locationInfo: JSX.Element | string | undefined;

    if (meeting.location) {
        locationInfo = (
            <div className='ml-1'>
                {'in '}
                <Link href={getBuildingUrl(meeting.location.building)} className='link' variant='h4'>
                    {meeting.location.building} {meeting.location.room}
                </Link>
            </div>
        );
    } else if (instructionMode !== 'Online') {
        locationInfo = (
            <Text variant='h4' as='p' className='ml-1'>
                (No location has been provided)
            </Text>
        );
    } else if (instructionMode === 'Online') {
        locationInfo = ', Online (Internet)';
    }

    return (
        <div className='flex'>
            <Text variant='h4' as='p'>
                {daysString} {timeString}
            </Text>
            <Text variant='h4' as='p'>
                {locationInfo}
            </Text>
        </div>
    );
}

/**
 * Render the time and location for the current class.
 *
 * @param course - The course to display the meeting info for.
 * @returns The JSX element for the meeting info.
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
                        : '(No time has been provided), Online (Internet)'}
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
