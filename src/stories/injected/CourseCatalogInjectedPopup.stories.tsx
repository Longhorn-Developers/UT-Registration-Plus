import type { Course } from '@shared/types/Course';
import { Status } from '@shared/types/Course';
import type { Meta, StoryObj } from '@storybook/react';
import CourseCatalogInjectedPopup from '@views/components/injected/CourseCatalogInjectedPopup/CourseCatalogInjectedPopup';
import React, { useState } from 'react';

import { bevoCourse, mikeScottCS314Course } from './mocked';

const meta = {
    title: 'Components/Injected/CourseCatalogInjectedPopup',
    component: CourseCatalogInjectedPopup,
    args: {
        open: true,
        onClose: () => {},
    },
    tags: ['autodocs'],
    render(args) {
        const [isOpen, setIsOpen] = useState(args.open);

        return <CourseCatalogInjectedPopup {...args} open={isOpen} onClose={() => setIsOpen(false)} />;
    },
} satisfies Meta<typeof CourseCatalogInjectedPopup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OpenCourse: Story = {
    args: {
        course: mikeScottCS314Course,
    },
};

export const ClosedCourse: Story = {
    args: {
        course: {
            ...mikeScottCS314Course,
            status: Status.CLOSED,
        } as Course,
    },
};

export const CourseWithNoData: Story = {
    args: {
        course: bevoCourse,
    },
};
