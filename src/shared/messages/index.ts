import { createMessenger } from 'chrome-extension-toolkit';
import TAB_MESSAGES from './TabMessages';
import BrowserActionMessages from './BrowserActionMessages';
import HotReloadingMessages from './HotReloadingMessages';
import TabManagementMessages from './TabManagementMessages';

/**
 * This is a type with all the message definitions that can be sent TO the background script
 */
export type BACKGROUND_MESSAGES = BrowserActionMessages & TabManagementMessages & HotReloadingMessages;

/**
 * A utility object that can be used to send type-safe messages to the background script
 */
export const bMessenger = createMessenger<BACKGROUND_MESSAGES>('background');


/**
 * A utility object that can be used to send type-safe messages to specific tabs
 */
export const tabMessenger = createMessenger<TAB_MESSAGES>('tab');
