import { UserScheduleStore } from '@shared/storage/UserScheduleStore';
import { toPng } from 'html-to-image';

export const CAL_MAP = {
    Sunday: 'SU',
    Monday: 'MO',
    Tuesday: 'TU',
    Wednesday: 'WE',
    Thursday: 'TH',
    Friday: 'FR',
    Saturday: 'SA',
} as const satisfies Record<string, string>;

/**
 * Retrieves the schedule from the UserScheduleStore based on the active index.
 * @returns {Promise<any>} A promise that resolves to the retrieved schedule.
 */
const getSchedule = async () => {
    const schedules = await UserScheduleStore.get('schedules');
    const activeIndex = await UserScheduleStore.get('activeIndex');
    const schedule = schedules[activeIndex];

    return schedule;
};

/**
 * Formats the given number of minutes into a string representation of HHMMSS format.
 *
 * @param minutes - The number of minutes to format.
 * @returns A string representation of the given minutes in HHMMSS format.
 */
export const formatToHHMMSS = (minutes: number) => {
    const hours = String(Math.floor(minutes / 60)).padStart(2, '0');
    const mins = String(minutes % 60).padStart(2, '0');
    return `${hours}${mins}00`;
};

/**
 * Downloads an ICS file with the given data.
 *
 * @param data - The data to be included in the ICS file.
 */
const downloadICS = (data: BlobPart) => {
    const blob: Blob = new Blob([data], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'schedule.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

/**
 * Saves the current schedule as a calendar file in the iCalendar format (ICS).
 * Fetches the current active schedule and converts it into an ICS string.
 * Downloads the ICS file to the user's device.
 */
export const saveAsCal = async () => {
    const schedule = await getSchedule(); // Assumes this fetches the current active schedule

    let icsString = 'BEGIN:VCALENDAR\nVERSION:2.0\nCALSCALE:GREGORIAN\nX-WR-CALNAME:My Schedule\n';

    schedule.courses.forEach(course => {
        course.schedule.meetings.forEach(meeting => {
            const { startTime, endTime, days, location } = meeting;

            // Format start and end times to HHMMSS
            const formattedStartTime = formatToHHMMSS(startTime);
            const formattedEndTime = formatToHHMMSS(endTime);

            // Map days to ICS compatible format
            console.log(days);
            const icsDays = days.map(day => CAL_MAP[day]).join(',');
            console.log(icsDays);

            // Assuming course has date started and ended, adapt as necessary
            // const year = new Date().getFullYear(); // Example year, adapt accordingly
            // Example event date, adapt startDate according to your needs
            const startDate = `20240101T${formattedStartTime}`;
            const endDate = `20240101T${formattedEndTime}`;

            icsString += `BEGIN:VEVENT\n`;
            icsString += `DTSTART:${startDate}\n`;
            icsString += `DTEND:${endDate}\n`;
            icsString += `RRULE:FREQ=WEEKLY;BYDAY=${icsDays}\n`;
            icsString += `SUMMARY:${course.fullName}\n`;
            icsString += `LOCATION:${location.building} ${location.room}\n`;
            icsString += `END:VEVENT\n`;
        });
    });

    icsString += 'END:VCALENDAR';

    downloadICS(icsString);
};

/**
 * Saves the calendar as a PNG image.
 */
export const saveCalAsPng = (calendarRef: React.RefObject<HTMLDivElement>) => {
    if (calendarRef.current) {
        toPng(calendarRef.current, { cacheBust: true })
            .then(dataUrl => {
                const link = document.createElement('a');
                link.download = 'my-calendar.png';
                link.href = dataUrl;
                link.click();
            })
            .catch(err => {
                console.error(err);
            });
    }
};
