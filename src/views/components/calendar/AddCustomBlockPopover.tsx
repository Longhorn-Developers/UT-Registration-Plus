import { Popover, PopoverButton } from '@headlessui/react';
import type { CustomBlockDraft } from '@shared/types/CustomBlock';
import { Button } from '@views/components/common/Button';
import SelectionPlusIcon from '~icons/ph/selection-plus';
import CustomBlockPopover from './CustomBlockPopover';

interface Props {
    onCreate: (block: CustomBlockDraft) => void | Promise<void>;
}

export default function AddCustomBlockPopover({ onCreate }: Props) {
    return (
        <Popover>
            {({ close }) => (
                <>
                    <PopoverButton as={Button} color='ut-black' size='small' variant='minimal' icon={SelectionPlusIcon}>
                        Add Block
                    </PopoverButton>
                    <CustomBlockPopover toolbar onSave={onCreate} onClose={close} />
                </>
            )}
        </Popover>
    );
}
