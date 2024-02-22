import { createMessenger } from 'chrome-extension-toolkit';
import BrowserActionMessages from './BrowserActionMessages';
import { CESMessage } from './CESMessage';
import TabManagementMessages from './TabManagementMessages';
import TAB_MESSAGES from './TabMessages';
import { UserScheduleMessages } from './UserScheduleMessages';

/**
 * This is a type with all the message definitions that can be sent TO the background script
 */
export type BACKGROUND_MESSAGES = BrowserActionMessages & TabManagementMessages & UserScheduleMessages & CESMessage;

/**
 * A utility object that can be used to send type-safe messages to the background script
 */
export const background = createMessenger<BACKGROUND_MESSAGES>('background');

/**
 * A utility object that can be used to send type-safe messages to specific tabs
 */
export const tabs = createMessenger<TAB_MESSAGES>('tab');
