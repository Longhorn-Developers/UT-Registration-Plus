import ExtensionRoot from '@views/components/common/ExtensionRoot/ExtensionRoot';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;
/**
 * Component that transforms the days dropdown into a series of checkboxes
 * on the course catalog search page
 *
 * @returns The rendered checkbox component or null if the container is not found.
 */
export default function DaysCheckbox(): JSX.Element | null {
    const [container, setContainer] = useState<HTMLDivElement | null>(null);
    const [daysValue, setDaysValue] = useState<number[]>([0, 0, 0, 0, 0, 0]);

    useEffect(() => {
        const daysDropdown = document.getElementById('mtg_days_st') as HTMLSelectElement | null;
        if (!daysDropdown) {
            console.error('Days dropdown not found');
            return;
        }

        const formElement = daysDropdown.closest('.form_element')!;
        const checkboxContainer = document.createElement('div');

        // Create a hidden input to store the value
        const hiddenInput = document.createElement('input');
        hiddenInput.type = 'hidden';
        hiddenInput.name = 'mtg_days_st';
        hiddenInput.id = 'mtg_days_st_hidden';
        hiddenInput.value = daysDropdown.value;

        // Remove old dropdown
        formElement.innerHTML = '';

        // Add the label back
        const newLabel = document.createElement('label');
        newLabel.className = 'primary_label';
        newLabel.htmlFor = 'mtg_days_st_hidden';
        newLabel.textContent = 'AND days';

        formElement.appendChild(newLabel);
        formElement.appendChild(hiddenInput);
        formElement.appendChild(checkboxContainer);
        setContainer(checkboxContainer);

        return () => {
            checkboxContainer.remove();
        };
    }, []);

    useEffect(() => {
        // Update hidden input when daysValue changes
        const hiddenInput = document.getElementById('mtg_days_st_hidden') as HTMLInputElement | null;
        if (hiddenInput) {
            hiddenInput.value = daysValue.join('');
        }
    }, [daysValue]);

    const handleDayChange = (position: number, checked: boolean) => {
        setDaysValue(prev => prev.with(position, checked ? 1 : 0));
    };

    if (!container) {
        return null;
    }

    return ReactDOM.createPortal(
        <ExtensionRoot>
            <ul className='text-black font-[Verdana,_"Helvetica_Neue",_Helvetica,_Arial,_sans-serif]'>
                {days.map((day, index) => (
                    <li key={day}>
                        <input
                            type='checkbox'
                            id={`day_${day}`}
                            checked={daysValue[index] === 1}
                            onChange={e => {
                                handleDayChange(index, e.target.checked);
                            }}
                            className='form-checkbox m-[3px_3px_3px_4px]'
                        />{' '}
                        <label htmlFor={`day_${day}`}>{day}</label>
                    </li>
                ))}
            </ul>
        </ExtensionRoot>,
        container
    );
}
