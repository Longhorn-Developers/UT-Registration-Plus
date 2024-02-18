import type { Meta, StoryObj } from '@storybook/react';
import ConflictsWithWarning from '@views/components/common/ConflictsWithWarning/ConflictsWithWarning';

const meta = {
    title: 'Components/Common/ConflictsWithWarning',
    component: ConflictsWithWarning,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        ConflictingCourse: { control: 'string' },
        SectionNumber: { control: 'string' },
    },
} satisfies Meta<typeof ConflictsWithWarning>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        ConflictingCourse: 'BVO 311C',
        SectionNumber: '47280',
    },
};
