import { colorsFlattened } from '@shared/util/themeColors';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@views/components/common/Button';
import CalendarDotsIcon from '~icons/ph/calendar-dots';
import ChatTextIcon from '~icons/ph/chat-text';
import FileTextIcon from '~icons/ph/file-text';
import ImageSquareIcon from '~icons/ph/image-square';
import MinusIcon from '~icons/ph/minus';
import PlusIcon from '~icons/ph/plus';
import SmileyIcon from '~icons/ph/smiley';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
    title: 'Components/Common/Button',
    component: Button,
    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
        layout: 'centered',
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: ['autodocs'],
    // More on argTypes: https://storybook.js.org/docs/api/argtypes
    args: {
        children: 'Button',
        icon: ImageSquareIcon,
    },
    argTypes: {
        children: { control: 'text' },
    },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
    args: {
        variant: 'filled',
        color: 'ut-black',
    },
};

export const Small: Story = {
    // @ts-expect-error
    args: {
        children: '',
    },
    render: props => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ display: 'flex', gap: '15px' }}>
                <Button {...props} variant='filled' color='ut-black' size='small'>
                    Button
                </Button>
                <Button {...props} variant='outline' color='ut-black' size='small'>
                    Button
                </Button>
                <Button {...props} variant='minimal' color='ut-black' size='small'>
                    Button
                </Button>
            </div>
            <hr />
            <div style={{ display: 'flex', gap: '15px' }}>
                <Button {...props} icon={ImageSquareIcon} variant='filled' color='ut-black' size='small' />
                <Button {...props} icon={ImageSquareIcon} variant='outline' color='ut-black' size='small' />
                <Button {...props} icon={ImageSquareIcon} variant='minimal' color='ut-black' size='small' />
            </div>
        </div>
    ),
};

export const Mini: Story = {
    // @ts-expect-error
    args: {
        children: '',
    },
    render: props => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ display: 'flex', gap: '15px' }}>
                <Button {...props} variant='filled' color='ut-black' size='mini'>
                    Button
                </Button>
                <Button {...props} variant='outline' color='ut-black' size='mini'>
                    Button
                </Button>
                <Button {...props} variant='minimal' color='ut-black' size='mini'>
                    Button
                </Button>
            </div>
            <hr />
            <div style={{ display: 'flex', gap: '15px' }}>
                <Button {...props} icon={ImageSquareIcon} variant='filled' color='ut-black' size='mini' />
                <Button {...props} icon={ImageSquareIcon} variant='outline' color='ut-black' size='mini' />
                <Button {...props} icon={ImageSquareIcon} variant='minimal' color='ut-black' size='mini' />
            </div>
        </div>
    ),
};

export const Disabled: Story = {
    args: {
        variant: 'filled',
        color: 'ut-black',
        disabled: true,
    },
};

// @ts-expect-error
export const Grid: Story = {
    render: props => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ display: 'flex', gap: '15px' }}>
                <Button {...props} variant='filled' color='ut-black' />
                <Button {...props} variant='outline' color='ut-black' />
                <Button {...props} variant='minimal' color='ut-black' />
            </div>

            <hr />

            <div style={{ display: 'flex', gap: '15px' }}>
                <Button {...props} variant='filled' color='ut-black' disabled />
                <Button {...props} variant='outline' color='ut-black' disabled />
                <Button {...props} variant='minimal' color='ut-black' disabled />
            </div>
        </div>
    ),
};

export const PrettyColors: Story = {
    // @ts-expect-error
    args: {
        children: '',
    },
    render: props => {
        const colorsNames = Object.keys(colorsFlattened) as (keyof typeof colorsFlattened)[];

        return (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '15px',
                }}
            >
                {colorsNames.map(color => (
                    <div style={{ display: 'flex', gap: '15px' }} key={color}>
                        <Button {...props} variant='filled' color={color}>
                            Button
                        </Button>
                        <Button {...props} variant='outline' color={color}>
                            Button
                        </Button>
                        <Button {...props} variant='minimal' color={color}>
                            Button
                        </Button>
                        <Button {...props} variant='filled' color={color} />
                        <Button {...props} variant='outline' color={color} />
                        <Button {...props} variant='minimal' color={color} />
                    </div>
                ))}
            </div>
        );
    },
};

// @ts-expect-error
export const CourseButtons: Story = {
    render: props => (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '15px',
                alignItems: 'center',
            }}
        >
            <Button {...props} variant='filled' color='ut-green' icon={PlusIcon}>
                Add Course
            </Button>
            <Button {...props} variant='filled' color='theme-red' icon={MinusIcon}>
                Remove Course
            </Button>
        </div>
    ),
    parameters: {
        design: {
            type: 'figma',
            url: 'https://www.figma.com/file/8tsCay2FRqctrdcZ3r9Ahw/UTRP?type=design&node-id=324-389&mode=design&t=BoS5xBrpSsjgQXqv-4',
        },
    },
};

export const CourseCatalogActionButtons: Story = {
    // @ts-expect-error
    args: {
        children: '',
    },
    render: props => (
        <div style={{ display: 'flex', gap: '15px' }}>
            <Button {...props} variant='filled' color='ut-burntorange' icon={CalendarDotsIcon} />
            <Button {...props} variant='outline' color='ut-blue' icon={ChatTextIcon}>
                RateMyProf
            </Button>
            <Button {...props} variant='outline' color='ut-teal' icon={SmileyIcon}>
                CES
            </Button>
            <Button {...props} variant='outline' color='ut-orange' icon={FileTextIcon}>
                Past Syllabi
            </Button>
            <Button {...props} variant='filled' color='ut-green' icon={PlusIcon}>
                Add Course
            </Button>
        </div>
    ),
};
