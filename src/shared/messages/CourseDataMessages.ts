import { Course } from '../types/Course';

export default interface CourseDataMessages {
    /**
     * Gets the distribution of grades for the given course
     * @returns an array of the number of students in each grade range from A+ to F, with the index of the array corresponding to the grade range
     */
    getDistribution: (data: { course: Course }) => number[] | undefined;
}
