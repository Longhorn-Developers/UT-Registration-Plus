import { createMessenger } from 'chrome-extension-toolkit';
import BrowserActionMessages from './BrowserActionMessages';
import TabManagementMessages from './TabManagementMessages';
import TAB_MESSAGES from './TabMessages';
import { UserScheduleMessages } from './UserScheduleMessages';

/**
 * This is a type with all the message definitions that can be sent TO the background script
 */
export type BACKGROUND_MESSAGES = BrowserActionMessages & TabManagementMessages & UserScheduleMessages;

/**
 * A utility object that can be used to send type-safe messages to the background script
 */
export const bMessenger = createMessenger<BACKGROUND_MESSAGES>('background');

/**
 * A utility object that can be used to send type-safe messages to specific tabs
 */
export const tabMessenger = createMessenger<TAB_MESSAGES>('tab');
