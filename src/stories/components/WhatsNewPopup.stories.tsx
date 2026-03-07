import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@views/components/common/Button';
import DialogProvider from '@views/components/common/DialogProvider/DialogProvider';
import WhatsNewPopup from '@views/components/common/WhatsNewPopup';
import useWhatsNewPopUp from '@views/hooks/useWhatsNew';

const meta = {
    title: 'Components/Common/WhatsNewPopup',
    component: WhatsNewPopup,
    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
        layout: 'centered',
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: ['autodocs'],
} satisfies Meta<typeof WhatsNewPopup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    render: () => (
        <DialogProvider>
            <InnerComponent />
        </DialogProvider>
    ),
};

const InnerComponent = () => {
    const showPopup = useWhatsNewPopUp();

    return (
        <Button color='ut-burntorange' onClick={() => showPopup()}>
            Open Dialog
        </Button>
    );
};
