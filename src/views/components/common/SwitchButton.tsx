import { Switch } from '@headlessui/react';
import type { JSX } from 'react';
import { useEffect, useState } from 'react';

type ToggleSwitchProps = {
    isChecked?: boolean;
    onChange?: (checked: boolean) => void;
    controlled?: boolean;
    disabled?: boolean;
    'aria-label'?: string;
};

/**
 * A custom switch button component.
 *
 * @param isChecked - The initial checked state of the switch button.
 * @param onChange - The callback function to be called when the switch button is toggled.
 * @returns The rendered SwitchButton component.
 */
const SwitchButton = ({ isChecked = true, onChange, controlled = false, ...props }: ToggleSwitchProps): JSX.Element => {
    const [enabled, setEnabled] = useState(isChecked);

    useEffect(() => {
        setEnabled(isChecked);
    }, [isChecked]);

    const handleChange = (checked: boolean) => {
        if (!controlled) setEnabled(checked);
        if (onChange) {
            onChange(checked);
        }
    };

    const checked = controlled ? isChecked : enabled;

    return (
        <Switch
            {...props}
            checked={checked}
            onChange={handleChange}
            className={`${checked ? 'bg-[#579D42]' : 'bg-surface-switch'}
          relative inline-flex items-center h-8 w-13 rounded-full transition-colors ease-in-out duration-200 min-w-[52px] cursor-pointer`}
        >
            <span
                className={`${checked ? 'translate-x-6' : 'translate-x-1'}
            inline-block w-6 h-6 transform bg-white rounded-full transition-transform ease-in-out duration-200`}
            />
        </Switch>
    );
};

export default SwitchButton;
