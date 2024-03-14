import type { Course } from '@shared/types/Course';
import { Status } from '@shared/types/Course';
import { UserSchedule } from '@shared/types/UserSchedule';
import type { Meta, StoryObj } from '@storybook/react';
import CourseCatalogInjectedPopup from '@views/components/injected/CourseCatalogInjectedPopup/CourseCatalogInjectedPopup';
import React, { useState } from 'react';

import { bevoCourse, bevoScheule, MikeScottCS314Course, MikeScottCS314Schedule } from './mocked';

const meta = {
    title: 'Components/Injected/CourseCatalogInjectedPopup',
    component: CourseCatalogInjectedPopup,
    args: {
        open: true,
        onClose: () => {},
    },
    argTypes: {
        course: {
            control: {
                type: 'object',
            },
        },
        activeSchedule: {
            control: {
                type: 'object',
            },
        },
        onClose: {
            control: {
                type: 'function',
            },
        },
    },
    render(args) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [isOpen, setIsOpen] = useState(args.open);

        return <CourseCatalogInjectedPopup {...args} open={isOpen} onClose={() => setIsOpen(false)} />;
    },
} satisfies Meta<typeof CourseCatalogInjectedPopup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OpenCourse: Story = {
    args: {
        course: MikeScottCS314Course,
        activeSchedule: MikeScottCS314Schedule,
    },
};

export const ClosedCourse: Story = {
    args: {
        course: {
            ...MikeScottCS314Course,
            status: Status.CLOSED,
        } as Course,
        activeSchedule: new UserSchedule({ courses: [], name: '', hours: 0, updatedAt: Date.now(), id: '' }),
    },
};

export const CourseWithNoData: Story = {
    args: {
        course: bevoCourse,
        activeSchedule: bevoScheule,
    },
};
