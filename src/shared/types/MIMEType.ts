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
    ANY: '*/*',
} as const satisfies Record<string, string>;

export default MIMEType;
