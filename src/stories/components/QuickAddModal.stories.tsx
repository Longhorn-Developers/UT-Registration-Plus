import type { Meta, StoryObj } from '@storybook/react-vite';
import QuickAddModal from '@views/components/common/QuickAddModal';
import { expect, userEvent, waitFor } from 'storybook/test';
import { mockBackground } from '../testing/backgroundMock';
import { findInShadow, typeInShadow } from '../testing/shadowQueries';

const meta = {
    title: 'Components/Common/QuickAddModal',
    component: QuickAddModal,
    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
        layout: 'centered',
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: ['autodocs'],
} satisfies Meta<typeof QuickAddModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    render: () => <InnerComponent />,
};

const InnerComponent = () => <QuickAddModal />;

// ---------------------------------------------------------------------------------------------
// Behavior tests (tag: 'behavior'). `pnpm test:storybook` runs these in a real browser, once in
// light mode and once in dark mode. The fake background below stands in for UT's sites, so the
// tests never touch the network.
// ---------------------------------------------------------------------------------------------

/** What UT's registrar page links to: a single Fall 2026 schedule. */
const SEMESTERS_PAGE = '<a href="https://registrar.utexas.edu/schedules/269">Fall 2026</a>';

/** Fake background: the user's login state, the semester list, and no course pages. */
const quickAddBackground = (isLoggedIn: boolean) =>
    mockBackground({
        validateLoginStatus: () => isLoggedIn,
        fetchFromUrl: ({ url }: { url: string }) =>
            url.includes('registrar.utexas.edu/schedules') ? SEMESTERS_PAGE : '',
        addCourse: () => undefined,
    });

/** Opens the Quick Add panel the way a user does, and returns its unique number field. */
async function openQuickAdd() {
    const quickAdd = await findInShadow(
        document.body,
        q => q.queryByRole('button', { name: 'Quick Add' }),
        'the Quick Add button'
    );
    await userEvent.click(quickAdd);

    return findInShadow(
        document.body,
        q => q.queryByRole('textbox', { name: 'Course unique number' }),
        'the unique number field'
    );
}

/** The panel's Add Course button. */
const findAddCourseButton = () =>
    findInShadow(document.body, q => q.queryByRole('button', { name: 'Add Course' }), 'the Add Course button');

/** The first non-transparent background color behind `el`, looking through shadow root boundaries. */
function backgroundBehind(el: Element): string {
    let node: Element | null = el;
    while (node) {
        const color = getComputedStyle(node).backgroundColor;
        if (color && color !== 'transparent' && color !== 'rgba(0, 0, 0, 0)') return color;
        const root = node.getRootNode();
        node = node.parentElement ?? (root instanceof ShadowRoot ? root.host : null);
    }
    return 'rgb(255, 255, 255)';
}

/** Rough brightness from 0 (black) to 1 (white) of an `rgb(...)` / `rgba(...)` color. */
function brightness(color: string): number {
    const [r = 255, g = 255, b = 255] = (color.match(/[\d.]+/g) ?? []).map(Number);
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

export const OpensWithSemesterSelected: Story = {
    tags: ['behavior'],
    render: () => <InnerComponent />,
    beforeEach: () => quickAddBackground(true),
    play: async ({ globals }) => {
        const uniqueNumber = await openQuickAdd();

        // The panel opens with the field ready, a hint, and the latest semester picked
        await expect(uniqueNumber).toBeVisible();
        await findInShadow(
            document.body,
            q => q.queryByText('Enter the unique number of the course you want.'),
            'the unique number hint'
        );
        await findInShadow(document.body, q => q.queryByText('Fall 2026'), 'the Fall 2026 semester');

        // Nothing to add yet
        await expect(await findAddCourseButton()).toBeDisabled();

        // The panel follows the extension's theme (wait for the theme fade to finish)
        const isDark = globals.theme === 'dark';
        await waitFor(() => expect(brightness(backgroundBehind(uniqueNumber)) < 0.5).toBe(isDark), { timeout: 2000 });
    },
};

export const LoggedOutShowsLoginPrompt: Story = {
    tags: ['behavior'],
    render: () => <InnerComponent />,
    beforeEach: () => quickAddBackground(false),
    play: async () => {
        await openQuickAdd();

        // Logged-out users are asked to log in, not told the course doesn't exist (see PR #940)
        const logIn = await findInShadow(
            document.body,
            q => q.queryByRole('link', { name: 'Log in' }),
            'the Log in link'
        );
        await expect(logIn).toBeVisible();
        await expect(await findAddCourseButton()).toBeDisabled();
    },
};

export const UnknownUniqueNumberIsNotFound: Story = {
    tags: ['behavior'],
    render: () => <InnerComponent />,
    beforeEach: () => quickAddBackground(true),
    play: async () => {
        const uniqueNumber = await openQuickAdd();
        await findInShadow(document.body, q => q.queryByText('Fall 2026'), 'the Fall 2026 semester');

        typeInShadow(uniqueNumber as HTMLInputElement, '12345');

        await findInShadow(
            document.body,
            q => q.queryByText('No courses found with this unique number.'),
            'the not-found message'
        );
        await expect(await findAddCourseButton()).toBeDisabled();
    },
};
