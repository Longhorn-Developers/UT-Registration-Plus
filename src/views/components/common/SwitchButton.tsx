import { Switch } from '@headlessui/react';
import React, { useEffect, useState } from 'react';

type ToggleSwitchProps = {
    isChecked?: boolean;
    onChange?: (checked: boolean) => void;
};

const SwitchButton: React.FC<ToggleSwitchProps> = ({ isChecked = true, onChange }) => {
    const [enabled, setEnabled] = useState(isChecked);

    useEffect(() => {
        setEnabled(isChecked);
    }, [isChecked]);

    const handleChange = (checked: boolean) => {
        setEnabled(checked);
        if (onChange) {
            onChange;
        }
    };

    return (
        <Switch
            checked={enabled}
            onChange={handleChange}
            className={`${enabled ? 'bg-[#579D42]' : 'bg-gray-400'} 
          relative inline-flex items-center h-8 w-13 rounded-full transition-colors ease-in-out duration-200`}
        >
            <span
                className={`${enabled ? 'translate-x-6' : 'translate-x-1'} 
            inline-block w-6 h-6 transform bg-white rounded-full transition-transform ease-in-out duration-200`}
            />
        </Switch>
    );
};

export default SwitchButton;
