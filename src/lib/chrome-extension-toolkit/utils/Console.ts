const LOG_BACKGROUND_COLOR = '#2196F3';
const LOG_TEXT_COLOR = '#fff';

const SUCCESS_BACKGROUND_COLOR = '#4CAF50';
const SUCCESS_TEXT_COLOR = '#fff';

const ERROR_BACKGROUND_COLOR = '#F44336';
const ERROR_TEXT_COLOR = '#fff';

const WARNING_BACKGROUND_COLOR = '#FFC107';
const WARNING_TEXT_COLOR = '#fff';

/**
 * Utility class for logging messages with different styles.
 */
export class Console {
    static log(...args: any[]) {
        console.log(
            `%c ${args[0]} `,
            `background: ${LOG_BACKGROUND_COLOR}; color: ${LOG_TEXT_COLOR}`,
            ...args.slice(1)
        );
    }

    static success(...args: any[]) {
        console.log(
            `%c ${args[0]} `,
            `background: ${SUCCESS_BACKGROUND_COLOR}; color: ${SUCCESS_TEXT_COLOR}`,
            ...args.slice(1)
        );
    }

    static error(...args: any[]) {
        console.error(
            `%c ${args[0]} `,
            `background: ${ERROR_BACKGROUND_COLOR}; color: ${ERROR_TEXT_COLOR}`,
            ...args.slice(1)
        );
    }

    static warn(...args: any[]) {
        console.warn(
            `%c ${args[0]} `,
            `background: ${WARNING_BACKGROUND_COLOR}; color: ${WARNING_TEXT_COLOR}`,
            ...args.slice(1)
        );
    }
}
