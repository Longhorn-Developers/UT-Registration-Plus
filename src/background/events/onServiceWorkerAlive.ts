import { openDebugTab } from '../util/openDebugTab';

/**
 * Called whenever the background service worker comes alive
 * (usually around 30 seconds to 5 minutes after it was last alive)
 */
export default function onServiceWorkerAlive() {
    openDebugTab();
}
