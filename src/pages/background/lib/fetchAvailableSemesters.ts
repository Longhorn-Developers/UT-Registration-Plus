import { background } from '@shared/messages';
import { CacheStore } from '@shared/storage/CacheStore';
import { parseSemesterCode, type Semester } from '@shared/types/Course';

const AVAILABLE_SEMESTERS_CACHE_TTL_MS = 1000 * 60 * 60 * 24;

let availableSemestersRequest: Promise<Semester[]> | null = null;

async function refreshAvailableSemesters(): Promise<Semester[]> {
    if (availableSemestersRequest) {
        return availableSemestersRequest;
    }

    availableSemestersRequest = (async () => {
        try {
            const htmlText = await background.fetchFromUrl({
                url: 'https://registrar.utexas.edu/schedules',
                method: 'GET',
                response: 'text',
            });

            const doc = new DOMParser().parseFromString(htmlText, 'text/html');
            const links = doc.querySelectorAll('a[href*="/schedules/"]');

            const semesterCodes = new Set<string>();
            links.forEach(link => {
                const match = link.getAttribute('href')?.match(/\/schedules\/(\d{3})$/);
                if (match?.[1]) {
                    semesterCodes.add(`20${match[1]}`);
                }
            });

            const semesters = [...semesterCodes].map(parseSemesterCode).filter((s): s is Semester => s !== undefined);
            await CacheStore.set('availableSemesters', {
                data: semesters,
                dataFetched: Date.now(),
            });

            return semesters;
        } catch (e) {
            console.error('Failed to fetch available semesters', e);
            const cached = await CacheStore.get('availableSemesters');
            return cached?.data ?? [];
        } finally {
            availableSemestersRequest = null;
        }
    })();

    return availableSemestersRequest;
}

/**
 * Fetches the available semester codes from UT's registrar schedules page.
 *
 * Scrapes the registrar website for semester schedule links and parses
 * each into a Semester object. Returns an empty array on failure.
 */
export async function fetchAvailableSemesters(): Promise<Semester[]> {
    const cached = await CacheStore.get('availableSemesters');

    if (cached === null) {
        return refreshAvailableSemesters();
    }

    if (Date.now() - cached.dataFetched >= AVAILABLE_SEMESTERS_CACHE_TTL_MS) {
        void refreshAvailableSemesters();
    }

    return cached.data;
}
