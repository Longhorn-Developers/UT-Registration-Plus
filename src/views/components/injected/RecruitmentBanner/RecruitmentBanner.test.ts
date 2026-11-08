import { describe, expect, it } from 'vitest';
import { getRecruitmentType } from './RecruitmentBanner';

describe('getRecruitmentType', () => {
    it('returns DEVELOPER for developer departments', () => {
        window.history.pushState({}, '', '?fos_fl=C S');
        expect(getRecruitmentType()).toBe('DEVELOPER');

        window.history.pushState({}, '', '?fos_fl=MIS');
        expect(getRecruitmentType()).toBe('DEVELOPER');
    });

    it('returns DESIGNER for designer departments', () => {
        window.history.pushState({}, '', '?fos_fl=I');
        expect(getRecruitmentType()).toBe('DESIGNER');

        window.history.pushState({}, '', '?fos_cn=DES');
        expect(getRecruitmentType()).toBe('DESIGNER');

        window.history.pushState({}, '', '?fos_fl=AET');
        expect(getRecruitmentType()).toBe('DESIGNER');
    });

    it('returns NONE for non-matching departments or when missing', () => {
        window.history.pushState({}, '', '?fos_fl=BIO');
        expect(getRecruitmentType()).toBe('NONE');

        window.history.pushState({}, '', '/');
        expect(getRecruitmentType()).toBe('NONE');
    });
});
