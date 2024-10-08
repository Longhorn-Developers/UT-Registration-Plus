import { Button } from '@views/components/common/Button';
import ExtensionRoot from '@views/components/common/ExtensionRoot/ExtensionRoot';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

/**
 *
 * @returns Button
 */
export default function InjectedButton(): JSX.Element | null {
    const [container, setContainer] = useState<HTMLDivElement | null>(null);

    useEffect(() => {
        const targetElement = document.getElementById('kgoui_Rcontent_I3_Rsecondary');

        if (targetElement) {
            const buttonContainer = document.createElement('div');
            targetElement.appendChild(buttonContainer);
            setContainer(buttonContainer);

            return () => {
                buttonContainer.remove();
            };
        }
    }, []);

    if (!container) {
        return null;
    }

    return ReactDOM.createPortal(
        <ExtensionRoot>
            <Button variant='filled' color='ut-black'>
                Click Me
            </Button>
        </ExtensionRoot>,
        container
    );
}
