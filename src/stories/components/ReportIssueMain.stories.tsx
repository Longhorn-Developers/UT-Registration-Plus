import type { Meta, StoryObj } from '@storybook/react-vite';
import ReportIssueMain from '@views/components/ReportIssueMain';
import { fn } from 'storybook/test';

const meta = {
    title: 'Components/Common/ReportIssueMain',
    component: ReportIssueMain,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof ReportIssueMain>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithCloseHandler: Story = {
    args: {
        onClose: fn(),
    },
};

export const InDialog: Story = {
    args: {
        onClose: fn(),
    },
    decorators: [
        Story => (
            <div className='rounded-lg border border-ut-offwhite/50 shadow-lg'>
                <Story />
            </div>
        ),
    ],
};
