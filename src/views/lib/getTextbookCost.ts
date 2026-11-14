import textbookCosts from '@assets/textbook-costs/textbook_costs.json';
import type { Course } from '@shared/types/Course';

const costs: Record<string, number[]> = textbookCosts.costs;

const formatDollars = (amount: number) => `$${Math.round(amount)}`;

const normalize = (value: string) => value.trim().replace(/\s+/g, ' ').toUpperCase();

/**
 * The textbook data cuts professor names to 18 characters (e.g. "FANNIN, DANIEL PAU"), while the course
 * catalog shows them in full ("FANNIN, DANIEL PAUL CLARK"), so names are compared by their first 18 characters.
 */
const NAME_LENGTH = 18;
const normalizeName = (name: string) => normalize(normalize(name).slice(0, NAME_LENGTH));

/**
 * Looks up the estimated cost of a course section's required textbooks.
 *
 * The data only covers one semester, and is keyed by course + professor, so a section from any other
 * semester (or one whose professor has no pricing data for that course) has no estimate.
 *
 * @param course - The course section to look up
 * @returns A display string like "$45 - $120" (or "$45" when there is no range), or undefined if there is no data
 */
export function getTextbookCost(course: Course): string | undefined {
    const { semester, department, number, instructors } = course;
    if (`${semester.season} ${semester.year}` !== textbookCosts.term) {
        return undefined;
    }

    const courseCode = normalize(`${department} ${number}`);
    const [low, high] =
        instructors
            .map(instructor => costs[`${courseCode}|${normalizeName(instructor.fullName ?? '')}`])
            .find(cost => cost !== undefined) ?? [];
    if (low === undefined || high === undefined) {
        return undefined;
    }

    const formattedLow = formatDollars(low);
    const formattedHigh = formatDollars(high);
    return formattedLow === formattedHigh ? formattedLow : `${formattedLow} - ${formattedHigh}`;
}
