const MIMEType = {
    JSON: 'application/json',
    HTML: 'text/html',
    TEXT: 'text/plain',
    FORM: 'application/x-www-form-urlencoded',
    MULTIPART: 'multipart/form-data',
    PDF: 'application/pdf',
    IMAGE: 'image/*',
    AUDIO: 'audio/*',
    VIDEO: 'video/*',
    CALENDAR: 'text/calendar',
    ANY: '*/*',
} as const satisfies Record<string, string>;

/**
 * Represents a key of the MIMEType object
 */
export type MIMETypeKey = keyof typeof MIMEType;

/**
 * Represents a value of the MIMEType object
 */
export type MIMETypeValue = (typeof MIMEType)[MIMETypeKey];

export default MIMEType;
