import type { Course } from '@shared/types/Course';
import Link from '@views/components/common/Link';
import Text from '@views/components/common/Text/Text';
import React from 'react';

interface LocationAndTimeProps {
    /* The info for the course to be display */
    course: Course;
}

/**
 * Renderes the time and location for the current class
 *
 * @param {Course} props.course - The course object containing course details.
 * @returns {JSX.Element} The rendered component.
 */
export default function LocationAndTime({ course }: LocationAndTimeProps): JSX.Element {
    const { schedule, instructionMode } = course;

    const getBuildingUrl = (building: string) =>
        `https://utdirect.utexas.edu/apps/campus/buildings/nlogon/maps/UTM/${building}`;

    return (
        <div className='mt-1 flex flex-col'>
            {Array.isArray(schedule.meetings) && schedule.meetings.length > 0
                ? schedule.meetings.map(meeting => {
                      const daysString = meeting.getDaysString({ format: 'long', separator: 'long' });
                      const timeString = meeting.getTimeString({ separator: ' to ', capitalize: false });
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
                          <Text
                              key={
                                  daysString +
                                  timeString +
                                  (meeting.location?.building ?? '') +
                                  (meeting.location?.room ?? '')
                              }
                              variant='h4'
                              as='p'
                          >
                              {daysString} {timeString} {locationInfo}
                          </Text>
                      );
                  })
                : (() => {
                      if (instructionMode !== 'Online') {
                          return (
                              <Text variant='h4' as='p'>
                                  No time and location has been provided.
                              </Text>
                          );
                      }
                      return (
                          <Text variant='h4' as='p'>
                              No time has been provided.
                          </Text>
                      );
                  })()}
        </div>
    );
}
