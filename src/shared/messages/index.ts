import { createMessenger } from 'chrome-extension-toolkit';

import type BrowserActionMessages from './BrowserActionMessages';
import type { CalendarBackgroundMessages, CalendarTabMessages } from './CalendarMessages';
import type CESMessage from './CESMessage';
import type TabInfoMessages from './TabInfoMessages';
import type TabManagementMessages from './TabManagementMessages';
import type { UserScheduleMessages } from './UserScheduleMessages';

/**
 * This is a type with all the message definitions that can be sent TO the background script
 */
export type BACKGROUND_MESSAGES = BrowserActionMessages &
    TabManagementMessages &
    UserScheduleMessages &
    CESMessage &
    CalendarBackgroundMessages;

/**
 * This is a type with all the message definitions that can be sent TO specific tabs
 */
export type TAB_MESSAGES = CalendarTabMessages & TabInfoMessages;

/**
 * A utility object that can be used to send type-safe messages to the background script
 */
export const background = createMessenger<BACKGROUND_MESSAGES>('background');

/**
 * A utility object that can be used to send type-safe messages to specific tabs
 */
export const tabs = createMessenger<TAB_MESSAGES>('foreground');
