import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * This creates a 'Begin a new search' link above the course catalog table.
 *
 * @returns a react portal to the new link container or null if the container is not found.
 */
export default function NewSearchLink() {
    const [container, setContainer] = useState<HTMLElement | null>(null);
    const newContainerId = 'ut-registration-plus-new-search-link';

    const searchLink = document.querySelector('#bottom_nav > p:nth-child(2)');
    const linkContent = {
        href: searchLink?.querySelector('a')?.href,
        title: searchLink?.querySelector('a')?.title,
        text: searchLink?.querySelector('a')?.textContent,
    };

    useEffect(() => {
        if (document.getElementById(newContainerId)) {
            return;
        }

        const innerBody = document.querySelector('#inner_body');
        if (!innerBody) {
            return;
        }

        const containerElement = document.createElement('div');
        containerElement.setAttribute('id', newContainerId);

        innerBody.prepend(containerElement);
        setContainer(containerElement);
    }, []);

    if (!container) {
        return null;
    }

    return createPortal(
        <p>
            <a href={linkContent.href} title={linkContent.title}>
                {linkContent.text}
            </a>
        </p>,
        container
    );
}
