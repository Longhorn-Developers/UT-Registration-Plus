import { OptionsStore } from '@shared/storage/OptionsStore';
import { UserScheduleStore } from '@shared/storage/UserScheduleStore';
import ExtensionRoot from '@views/components/common/ExtensionRoot/ExtensionRoot';
import { Suspense } from 'react';
import type { Root } from 'react-dom/client';
import { createRoot } from 'react-dom/client';
import { suspendUntilStoresReady } from 'src/lib/chrome-extension-toolkit/storage/createStore';

import SidebarMain from './SidebarMain';
import SidebarScheduleList from './SidebarScheduleList';

const SIDEBAR_HOST_ID = 'utrp-registration-sidebar';
const SIDEBAR_LAYOUT_STYLE_ID = 'utrp-registration-sidebar-layout';
const SIDEBAR_WIDTH_PX = 430;

// The sidebar sits between the registration page's header and footer
const PAGE_HEADER_SELECTOR = '#header';
const PAGE_FOOTER_SELECTOR = '#utd_close';

let mounted: { host: HTMLDivElement; root: Root; cleanup: () => void } | null = null;

function SidebarBootstrap() {
    suspendUntilStoresReady([UserScheduleStore, OptionsStore]);

    // Like the toolbar popup, the sidebar keeps its light colors and doesn't sync the theme
    return (
        <SidebarMain>
            <SidebarScheduleList />
        </SidebarMain>
    );
}

/**
 * Mounts the sidebar on the right side of the registration page.
 * Does nothing if it is already mounted, and replaces a leftover sidebar from a previous extension context.
 */
export function mountRegistrationSidebar(): void {
    if (mounted?.host.isConnected) return;

    document.getElementById(SIDEBAR_HOST_ID)?.remove();
    document.getElementById(SIDEBAR_LAYOUT_STYLE_ID)?.remove();

    // Reserve the sidebar's width so the registration form and class table aren't covered
    const layoutStyle = document.createElement('style');
    layoutStyle.id = SIDEBAR_LAYOUT_STYLE_ID;
    layoutStyle.textContent = `#utd_container { margin-right: ${SIDEBAR_WIDTH_PX}px; }`;
    document.head.appendChild(layoutStyle);

    const host = document.createElement('div');
    host.id = SIDEBAR_HOST_ID;
    Object.assign(host.style, {
        position: 'fixed',
        top: '0px',
        right: '0px',
        bottom: '0px',
        width: `${SIDEBAR_WIDTH_PX}px`,
        zIndex: '2147483000',
    });
    document.body.appendChild(host);

    // Keep the sidebar between the header and footer as the page scrolls
    const updatePosition = () => {
        const headerBottom = document.querySelector(PAGE_HEADER_SELECTOR)?.getBoundingClientRect().bottom ?? 0;
        const footerTop =
            document.querySelector(PAGE_FOOTER_SELECTOR)?.getBoundingClientRect().top ?? window.innerHeight;
        // +1px clears the header's bottom border
        host.style.top = `${Math.max(0, Math.ceil(headerBottom) + 1)}px`;
        host.style.bottom = `${Math.max(0, window.innerHeight - footerTop)}px`;
    };
    updatePosition();
    window.addEventListener('scroll', updatePosition, { passive: true });
    window.addEventListener('resize', updatePosition, { passive: true });

    const root = createRoot(host);
    root.render(
        <ExtensionRoot>
            <Suspense fallback={null}>
                <SidebarBootstrap />
            </Suspense>
        </ExtensionRoot>
    );

    mounted = {
        host,
        root,
        cleanup: () => {
            window.removeEventListener('scroll', updatePosition);
            window.removeEventListener('resize', updatePosition);
            layoutStyle.remove();
        },
    };
}

/**
 * Removes the sidebar and restores the page layout
 */
export function unmountRegistrationSidebar(): void {
    if (!mounted) return;

    mounted.root.unmount();
    mounted.host.remove();
    mounted.cleanup();
    mounted = null;
}
