import { CourseLevel } from '@views/lib/courseFinder';
import { describe, expect, it } from 'vitest';

import { DEFAULT_LEVELS, sortLevels } from '../useCourseFinderForm';

describe('useCourseFinderForm::sortLevels', () => {
    it('puts levels in the order they are shown, whatever order they were picked in', () => {
        expect(sortLevels([CourseLevel.GRADUATE, CourseLevel.LOWER])).toEqual([
            CourseLevel.LOWER,
            CourseLevel.GRADUATE,
        ]);
        expect(sortLevels([CourseLevel.UPPER, CourseLevel.LOWER])).toEqual([...DEFAULT_LEVELS]);
    });
});
