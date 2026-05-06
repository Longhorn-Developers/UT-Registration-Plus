import type { Meta, StoryObj } from "@storybook/react-vite";
import Settings from "@views/components/settings/Settings";

const meta = {
    title: "Components/Common/Settings",
    component: Settings,
    parameters: {
        layout: "centered",
        chromatic: { delay: 60000 },
    },
    tags: ["autodocs"],
    argTypes: {},
} satisfies Meta<typeof Settings>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {},
};
