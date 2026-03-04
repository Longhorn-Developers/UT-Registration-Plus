import { createUseMessage } from '@chrome-extension-toolkit';
import type { TAB_MESSAGES } from '@shared/messages';

export const useTabMessage = createUseMessage<TAB_MESSAGES>();
