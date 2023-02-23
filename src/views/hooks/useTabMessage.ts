import { createUseMessage } from 'chrome-extension-toolkit';
import TAB_MESSAGES from 'src/shared/messages/TabMessages';

export const useTabMessage = createUseMessage<TAB_MESSAGES>();