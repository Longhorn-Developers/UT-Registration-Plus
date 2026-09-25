import { ExtensionStore } from '@shared/storage/ExtensionStore';
import { UserScheduleStore } from '@shared/storage/UserScheduleStore';
import { scheduleToGoogleCalendarEvents } from '@views/components/calendar/utils';

const CALENDAR_API_BASE = 'https://www.googleapis.com/calendar/v3';

/**
 * Error thrown when the Google Calendar API responds with a non-2xx status.
 */
export class GoogleCalendarApiError extends Error {
    constructor(
        readonly status: number,
        message: string
    ) {
        super(`Google Calendar API error ${status}: ${message}`);
        this.name = 'GoogleCalendarApiError';
    }
}

/**
 * Google Calendar export needs an OAuth client ID baked into the manifest at build time
 * (see GOOGLE_OAUTH_CLIENT_ID in src/manifest.ts), and chrome.identity only exists in Chrome.
 *
 * @returns Whether this build of the extension can add schedules to Google Calendar.
 */
export const isGoogleCalendarExportAvailable = (): boolean =>
    !!chrome.identity?.getAuthToken && !!chrome.runtime.getManifest().oauth2?.client_id;

/**
 * @returns Whether the error came from the user closing or declining the Google sign-in prompt.
 */
export const isGoogleAuthCancelled = (error: unknown): boolean =>
    error instanceof Error && /did not approve|cancel/i.test(error.message);

/**
 * Gets an OAuth access token for the scopes in the manifest, prompting the user to sign in if needed.
 */
const getAuthToken = async (): Promise<string> => {
    const { token } = await chrome.identity.getAuthToken({ interactive: true });
    if (!token) {
        throw new Error('Google sign-in was cancelled');
    }
    return token;
};

/**
 * Calls the Google Calendar API, retrying once with a fresh token if the cached one was rejected.
 *
 * @param path - The API path, relative to /calendar/v3
 * @param init - Fetch options; a JSON body should already be stringified
 * @returns The parsed JSON response, or undefined for empty responses
 */
const calendarFetch = async <T = undefined>(path: string, init: RequestInit = {}): Promise<T> => {
    const request = (token: string) =>
        fetch(`${CALENDAR_API_BASE}${path}`, {
            ...init,
            headers: {
                Authorization: `Bearer ${token}`,
                ...(init.body && { 'Content-Type': 'application/json' }),
            },
        });

    let token = await getAuthToken();
    let response = await request(token);

    if (response.status === 401) {
        await chrome.identity.removeCachedAuthToken({ token });
        token = await getAuthToken();
        response = await request(token);
    }

    if (!response.ok) {
        throw new GoogleCalendarApiError(response.status, await response.text());
    }

    return (response.status === 204 ? undefined : await response.json()) as T;
};

/**
 * Deletes every event on a calendar created by the extension.
 * (The API's calendars.clear only works on primary calendars.)
 */
const deleteAllEvents = async (calendarId: string) => {
    const calendarPath = `/calendars/${encodeURIComponent(calendarId)}`;
    let pageToken: string | undefined;

    do {
        const params = new URLSearchParams({ maxResults: '2500', fields: 'items(id),nextPageToken' });
        if (pageToken) params.set('pageToken', pageToken);

        const page = await calendarFetch<{ items?: { id: string }[]; nextPageToken?: string }>(
            `${calendarPath}/events?${params}`
        );

        for (const { id } of page.items ?? []) {
            try {
                await calendarFetch(`${calendarPath}/events/${encodeURIComponent(id)}`, { method: 'DELETE' });
            } catch (error) {
                // Already gone
                if (!(error instanceof GoogleCalendarApiError && error.status === 410)) throw error;
            }
        }

        pageToken = page.nextPageToken;
    } while (pageToken);
};

/**
 * Returns an empty calendar for the schedule, reusing the one from a previous export if it still exists
 * so that exporting again replaces the schedule's events instead of duplicating them.
 */
const prepareCalendar = async (scheduleId: string, calendar: { summary: string; timeZone: string }) => {
    const calendarIds = (await ExtensionStore.get('googleCalendarIds')) ?? {};
    const existingId = calendarIds[scheduleId];

    if (existingId) {
        try {
            // Keep the calendar's name in sync if the schedule was renamed
            await calendarFetch(`/calendars/${encodeURIComponent(existingId)}`, {
                method: 'PATCH',
                body: JSON.stringify({ summary: calendar.summary }),
            });
            await deleteAllEvents(existingId);
            return existingId;
        } catch (error) {
            // The user deleted the calendar since the last export, so make a new one
            if (!(error instanceof GoogleCalendarApiError && [404, 410].includes(error.status))) throw error;
        }
    }

    const { id } = await calendarFetch<{ id: string }>('/calendars', {
        method: 'POST',
        body: JSON.stringify({
            ...calendar,
            description: 'Class schedule exported from UT Registration Plus',
        }),
    });
    await ExtensionStore.set('googleCalendarIds', { ...calendarIds, [scheduleId]: id });

    return id;
};

/**
 * Adds a schedule to the user's Google Calendar, as its own calendar named after the schedule.
 * Exporting the same schedule again replaces its events rather than duplicating them.
 *
 * @param scheduleId - ID of the schedule to export
 * @returns A Google Calendar URL for the week of the first class, or null if the schedule has no
 * meetings that can be put on a calendar (so nothing was exported)
 */
export const addScheduleToGoogleCalendar = async (scheduleId: string): Promise<string | null> => {
    const schedules = await UserScheduleStore.get('schedules');
    const schedule = schedules.find(s => s.id === scheduleId);

    if (!schedule) {
        throw new Error('No schedule found');
    }

    const events = scheduleToGoogleCalendarEvents(schedule);
    if (events.length === 0) {
        return null;
    }

    const timeZone = events[0]?.start.timeZone ?? 'America/Chicago';
    const calendarId = await prepareCalendar(schedule.id, { summary: schedule.name, timeZone });

    // Sequential to stay well under Google's per-user rate limit; schedules are only a handful of events
    for (const event of events) {
        await calendarFetch(`/calendars/${encodeURIComponent(calendarId)}/events`, {
            method: 'POST',
            body: JSON.stringify(event),
        });
    }

    // Dates are yyyy-MM-dd, so they sort chronologically as strings
    const [firstClassDate = ''] = events.map(event => event.start.dateTime.slice(0, 10)).sort();
    const [year, month, day] = firstClassDate.split('-').map(Number);

    return `https://calendar.google.com/calendar/r/week/${year}/${month}/${day}`;
};
