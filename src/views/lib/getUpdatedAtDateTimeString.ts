/**
 * Returns a formatted string of the last time the schedule was updated.
 *
 * @param updatedAt - The time in milliseconds since the epoch when the schedule was last updated.
 * @returns DateTime formatted as HH:MM AM/PM MM/DD/YYYY
 */
export function getUpdatedAtDateTimeString(updatedAt: number): string {
    const updatedAtDate = new Date(updatedAt);

    const timeFormat = new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    }).format(updatedAtDate);
    const dateFormat = new Intl.DateTimeFormat('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    }).format(updatedAtDate);

    return `${timeFormat} ${dateFormat}`;
}
