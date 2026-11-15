import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import RecruitmentBanner from './RecruitmentBanner';

// Lets React know updates in these tests are wrapped in act()
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const DISCORD_URL = 'https://discord.gg/7pQDBGdmb7';
const GITHUB_URL = 'https://github.com/Longhorn-Developers/UT-Registration-Plus';

let table: HTMLTableElement;
let container: HTMLDivElement;
let root: Root;

/** Shows the banner the way it shows on the course schedule's results for a field of study */
const renderFor = (fieldOfStudy: string) => {
    window.history.replaceState(null, '', `/?fos_fl=${encodeURIComponent(fieldOfStudy)}`);
    act(() => root.render(<RecruitmentBanner />));
};

const bannerLinks = () =>
    [...document.querySelectorAll('#ut-registration-plus-table-head a')].map(link => link.getAttribute('href'));

beforeEach(() => {
    table = document.createElement('table');
    document.body.append(table);
    container = document.createElement('div');
    document.body.append(container);
    root = createRoot(container);
});

afterEach(() => {
    act(() => root.unmount());
    document.getElementById('ut-registration-plus-table-head')?.remove();
    container.remove();
    table.remove();
    window.history.replaceState(null, '', '/');
});

describe('RecruitmentBanner', () => {
    // Informatics, Design and Arts & Entertainment Technologies get the designer banner, C S the developer one
    it.each([
        ['I', 'Design for thousands'],
        ['DES', 'Design for thousands'],
        ['AET', 'Design for thousands'],
        ['C S', 'Interested in helping us develop'],
    ])('links the %s banner to the Discord server and GitHub', (fieldOfStudy, text) => {
        renderFor(fieldOfStudy);
        expect(document.getElementById('ut-registration-plus-table-head')?.textContent).toContain(text);
        expect(bannerLinks()).toEqual([DISCORD_URL, GITHUB_URL]);
    });

    it('shows no banner for a field of study it doesn’t recruit from', () => {
        renderFor('M');
        expect(document.getElementById('ut-registration-plus-table-head')).toBeNull();
    });
});
