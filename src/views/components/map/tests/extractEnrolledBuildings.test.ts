import { describe, expect, it } from 'vitest';

import type { ProcessInPersonMeetings } from '../types';
import { extractEnrolledBuildings } from '../utils';

// Minimal helpers to build mock ProcessInPersonMeetings entries
const makeMeeting = (building: string | null): ProcessInPersonMeetings =>
    ({
        location: building ? { building, room: '101' } : null,
    }) as unknown as ProcessInPersonMeetings;

describe('extractEnrolledBuildings', () => {
    it('returns an empty set for an empty course list', () => {
        expect(extractEnrolledBuildings([])).toEqual(new Set());
    });

    it('collects the building from a single meeting', () => {
        const result = extractEnrolledBuildings([makeMeeting('ETC')]);
        expect(result).toEqual(new Set(['ETC']));
    });

    it('deduplicates buildings that appear in multiple meetings', () => {
        const meetings = [makeMeeting('ETC'), makeMeeting('JES'), makeMeeting('ETC')];
        const result = extractEnrolledBuildings(meetings);
        expect(result).toEqual(new Set(['ETC', 'JES']));
    });

    it('excludes meetings whose location is null', () => {
        const meetings = [makeMeeting('GDC'), makeMeeting(null)];
        const result = extractEnrolledBuildings(meetings);
        expect(result).toEqual(new Set(['GDC']));
    });

    it('handles multiple distinct buildings', () => {
        const buildings = ['ETC', 'JES', 'GDC', 'WEL', 'PAR'];
        const meetings = buildings.map(makeMeeting);
        const result = extractEnrolledBuildings(meetings);
        expect(result).toEqual(new Set(buildings));
    });
});
