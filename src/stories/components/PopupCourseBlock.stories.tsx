import { Course, Status } from '@shared/types/Course';
import { getCourseColors } from '@shared/util/colors/base';
import { tailwindColorways } from '@shared/util/storybook';
import type { Meta, StoryObj } from '@storybook/react-vite';
import PopupCourseBlock from '@views/components/common/PopupCourseBlock';

import { bevoCourse } from '../injected/mocked';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
    title: 'Components/Common/PopupCourseBlock',
    component: PopupCourseBlock,
    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
        layout: 'centered',
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: ['autodocs'],
    // More on argTypes: https://storybook.js.org/docs/api/argtypes
    args: {
        colors: getCourseColors('emerald'),
        course: bevoCourse,
    },
    argTypes: {
        colors: {
            description: 'the colors to use for the course block',
            control: 'object',
        },
        course: {
            description: 'the course to show data for',
            control: 'object',
        },
    },
} satisfies Meta<typeof PopupCourseBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
    args: {},
};

export const Variants: Story = {
    render: props => (
        <div className='grid grid-cols-2 max-w-2xl w-90vw gap-x-4 gap-y-2'>
            <PopupCourseBlock {...props} course={new Course({ ...bevoCourse, status: Status.OPEN })} />
            <PopupCourseBlock {...props} course={new Course({ ...bevoCourse, status: Status.CLOSED })} />
            <PopupCourseBlock {...props} course={new Course({ ...bevoCourse, status: Status.WAITLISTED })} />
            <PopupCourseBlock {...props} course={new Course({ ...bevoCourse, status: Status.CANCELLED })} />
        </div>
    ),
};

export const AllColors: Story = {
    render: () => (
        <div className='grid grid-flow-col grid-cols-2 grid-rows-9 max-w-2xl w-90vw gap-x-4 gap-y-2'>
            {tailwindColorways.map(color => (
                <PopupCourseBlock key={color.primaryColor} course={bevoCourse} colors={color} />
            ))}
        </div>
    ),
    parameters: {
        design: {
            type: 'figma',
            url: 'https://www.figma.com/file/8tsCay2FRqctrdcZ3r9Ahw/UTRP?type=design&node-id=1046-6714&mode=design&t=5Bjr7qGHNXmjfMTc-0',
        },
    },
};
