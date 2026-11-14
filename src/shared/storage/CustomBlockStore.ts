import { createLocalStore } from '@chrome-extension-toolkit';
import type { CustomBlock } from '@shared/types/CustomBlock';

export const CustomBlockStore = createLocalStore<{ blocks: CustomBlock[] }>('CustomBlockStore', { blocks: [] });
