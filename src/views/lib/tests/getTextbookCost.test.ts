import textbookCosts from '@assets/textbook-costs/textbook_costs.json';
import type { Course } from '@shared/types/Course';
import { getTextbookCost } from '@views/lib/getTextbookCost';
import { describe, expect, it } from 'vitest';

const [season, year] = textbookCosts.term.split(' ') as [Course['semester']['season'], string];
const costs: Record<string, number[]> = textbookCosts.costs;
const firstKey = Object.keys(costs)[0] ?? '';

/** Builds the minimal Course the lookup needs from a data key like "ACC 311|SMITH, JOHN A" */
const makeCourse = (key: string, semester = { season, year: Number(year) }) => {
    const [courseCode = '', fullName = ''] = key.split('|');
    const lastSpace = courseCode.lastIndexOf(' ');

    return {
        department: courseCode.slice(0, lastSpace),
        number: courseCode.slice(lastSpace + 1),
        instructors: [{ fullName }],
        semester,
    } as Course;
};

describe('getTextbookCost', () => {
    it('formats a range for a course whose low and high prices differ', () => {
        const [key = '', [low, high] = []] =
            Object.entries(costs).find(([, [low = 0, high = 0]]) => Math.round(low) !== Math.round(high)) ?? [];

        expect(getTextbookCost(makeCourse(key))).toBe(`$${Math.round(low ?? 0)} - $${Math.round(high ?? 0)}`);
    });

    it('formats a single price when low and high are the same', () => {
        const [key = '', [low] = []] = Object.entries(costs).find(([, [low, high]]) => low === high) ?? [];

        expect(getTextbookCost(makeCourse(key))).toBe(`$${Math.round(low ?? 0)}`);
    });

    it('ignores casing and extra whitespace in the professor name', () => {
        const [courseCode = '', fullName = ''] = firstKey.split('|');
        const messyName = `  ${fullName.toLowerCase().replace(', ', ',   ')} `;

        expect(getTextbookCost(makeCourse(`${courseCode}|${messyName}`))).toBeDefined();
    });

    it('returns undefined when a different professor teaches the course', () => {
        const [courseCode] = firstKey.split('|');

        expect(getTextbookCost(makeCourse(`${courseCode}|NOBODY, NOT A PROFESSOR`))).toBeUndefined();
    });

    it('returns undefined for a section from a different semester', () => {
        expect(getTextbookCost(makeCourse(firstKey, { season, year: Number(year) + 1 }))).toBeUndefined();
    });
});
