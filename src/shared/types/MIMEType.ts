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

export type MIMETypeKey = keyof typeof MIMEType;

export default MIMEType;
