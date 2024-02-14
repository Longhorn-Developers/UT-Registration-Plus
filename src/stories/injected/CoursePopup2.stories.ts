import { Meta } from '@storybook/react';
import { Course } from 'src/shared/types/Course';

const testCourse: Course = {
    
}

const meta: Meta<typeof CoursePopup2> = {
    component: CoursePopup2,
};

export default meta;
type Story = StoryObj<typeof meta>;
export const Open: Story = {

};
