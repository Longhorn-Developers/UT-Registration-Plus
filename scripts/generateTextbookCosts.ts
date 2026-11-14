/**
 * Converts the scraped textbook `sections.csv` into the compact JSON the course popup reads.
 *
 * Usage: bun run scripts/generateTextbookCosts.ts <path/to/sections.csv>
 *
 * Prices are keyed by course + professor (e.g. "ACC 311|SMITH, JOHN A"), since every section a professor
 * teaches of a course shares the same materials. Flagged (unreliable) sections never set a price themselves.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const OUTPUT_PATH = resolve(import.meta.dirname, '../src/assets/textbook-costs/textbook_costs.json');

/**
 * Splits one CSV line into fields, honoring double-quoted fields (which may contain commas).
 *
 * @param line - A single line of CSV text
 * @returns The fields in that line
 */
function parseCsvLine(line: string): string[] {
    const fields: string[] = [];
    let field = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (inQuotes) {
            if (char === '"' && line[i + 1] === '"') {
                field += '"';
                i++;
            } else if (char === '"') {
                inQuotes = false;
            } else {
                field += char;
            }
        } else if (char === '"') {
            inQuotes = true;
        } else if (char === ',') {
            fields.push(field);
            field = '';
        } else {
            field += char;
        }
    }
    fields.push(field);
    return fields;
}

const normalize = (value: string) => value.trim().replace(/\s+/g, ' ').toUpperCase();

const inputPath = process.argv[2];
if (!inputPath) {
    console.error('Usage: bun run scripts/generateTextbookCosts.ts <path/to/sections.csv>');
    process.exit(1);
}

const [headerLine = '', ...lines] = readFileSync(inputPath, 'utf8')
    .split(/\r?\n/)
    .filter(line => line.length > 0);
const header = parseCsvLine(headerLine);
const column = (name: string) => {
    const index = header.indexOf(name);
    if (index === -1) throw new Error(`Missing column "${name}" in ${inputPath}`);
    return index;
};
const [termCol, uniqueCol, courseCol, instructorCol, lowCol, highCol, flagsCol, scrapedCol] = [
    column('term'),
    column('unique_no'),
    column('course'),
    column('instructor'),
    column('required_low'),
    column('required_high'),
    column('flags'),
    column('scraped_at'),
];

const terms = new Set<string>();
const costs: Record<string, [low: number, high: number]> = {};
let scrapedAt = '';

for (const line of lines) {
    const row = parseCsvLine(line);
    const instructor = normalize(row[instructorCol] ?? '');
    const low = row[lowCol] ?? '';
    const high = row[highCol] ?? '';

    // Skip non-registrar sections (e.g. ELC "G2") that have no unique number, and sections with no professor
    if (!/^\d{5}$/.test(row[uniqueCol] ?? '') || !instructor) continue;

    // Every section of a course taught by the same professor shares one estimate
    const key = `${normalize(row[courseCol] ?? '')}|${instructor}`;
    terms.add(row[termCol] ?? '');
    scrapedAt = row[scrapedCol] ?? scrapedAt;

    // Flagged (unreliable) sections are ignored, so they take the price of the professor's clean sections, if any
    if (!row[flagsCol] && low !== '' && high !== '') {
        const existing = costs[key];
        if (existing && (existing[0] !== Number(low) || existing[1] !== Number(high))) {
            throw new Error(`Sections of ${key} disagree on price without being flagged`);
        }
        costs[key] = [Number(low), Number(high)];
    }
}

if (terms.size !== 1) {
    throw new Error(`Expected exactly one term in ${inputPath}, found: ${[...terms].join(', ') || 'none'}`);
}

const output = { term: [...terms][0], scrapedAt, costs };
writeFileSync(OUTPUT_PATH, `${JSON.stringify(output)}\n`);
console.log(`Wrote ${Object.keys(costs).length} course + professor pairs for ${output.term} to ${OUTPUT_PATH}`);
