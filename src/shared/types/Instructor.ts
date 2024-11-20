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
     * Get a string representation of the instructor
     *
     * @param options - The options for how to format the instructor string
     * @returns A string representation of the instructor
     */
    toString(options: InstructorFormatOptions): string {
        const { firstName, lastName, fullName } = this;
        const { format } = options;

        switch (format) {
            case 'first_last':
                if (firstName && lastName) {
                    return `${capitalize(firstName)} ${capitalize(lastName)}`;
                }

                if (lastName) {
                    return capitalize(lastName);
                }

                if (fullName) {
                    return fullName;
                }

                return '';
            case 'last':
                if (lastName) {
                    return capitalize(lastName);
                }

                if (fullName) {
                    return fullName;
                }

                return '';
            default:
                throw new Error(`Invalid Instructor String format: ${format}`);
        }
    }
}

/**
 * Options for how to format the instructor string
 */
type InstructorFormatOptions = {
    /** How do you want the names of the professors formatted */
    format: 'first_last' | 'last';
};
