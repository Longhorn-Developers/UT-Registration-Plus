import type TAB_MESSAGES from '@shared/messages/TabMessages';
import { createUseMessage } from 'chrome-extension-toolkit';

export const useTabMessage = createUseMessage<TAB_MESSAGES>();
