import { capitalize } from '@shared/util/string';
import type { Serialized } from 'chrome-extension-toolkit';

/**
 * A type representing an instructor for a course (who teaches it)
 */
export default class Instructor {
    fullName?: string;
    firstName?: string;
    lastName?: string;
    middleInitial?: string;

    constructor(instructor: Serialized<Instructor>) {
        Object.assign(this, {
            ...instructor,
        });
    }

    /**
     * Get the URL to the instructor's directory page on the UT Directory website
     * @returns a URL string to the instructor's directory page
     */
    getDirectoryUrl(): string {
        const name = this.toString({
            format: 'full_name',
            case: 'capitalize',
        });

        const url = new URL('https://directory.utexas.edu/index.php');
        url.searchParams.set('q', name);
        url.searchParams.set('scope', 'faculty/staff');
        url.searchParams.set('submit', 'Search');

        return url.toString();
    }

    /**
     * Get a string representation of the instructor
     * @param options the options for how to format the instructor string
     * @returns a string representation of the instructor
     */
    toString(options: InstructorFormatOptions): string {
        const { firstName, lastName, fullName } = this;
        const { format, case: caseType } = options;

        const process = (str: string) => {
            if (caseType === 'lowercase') {
                return str.toLowerCase();
            }
            if (caseType === 'uppercase') {
                return str.toUpperCase();
            }
            return capitalize(str);
        };

        if (format === 'abbr' && firstName && lastName && firstName[0]) {
            return `${process(firstName[0])}. ${process(lastName)}`;
        }
        if (format === 'full_name' && fullName) {
            return process(fullName);
        }
        if (format === 'first_last' && firstName && lastName) {
            return `${process(firstName)} ${process(lastName)}`;
        }
        if (format === 'last' && lastName) {
            return process(lastName);
        }

        throw new Error(`Invalid Instructor String format: ${format}`);
    }
}

/**
 * Options for how to format the instructor string
 */
type InstructorFormatOptions = {
    /** How do you want the names of the professors formatted */
    format: 'abbr' | 'first_last' | 'last' | 'full_name';
    /**
     * What the case of the string should be
     */
    case: 'capitalize' | 'lowercase' | 'uppercase';
};
