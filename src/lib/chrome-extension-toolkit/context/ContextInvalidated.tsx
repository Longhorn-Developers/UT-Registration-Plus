import React, { useState } from 'react';

const containerStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    padding: '8px',
    fontSize: '20px',
    textAlign: 'center',
    borderTopLeftRadius: '20px',
    borderTopRightRadius: '20px',
    zIndex: 999999999999,
    cursor: 'pointer',
};

const closeButtonStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: '8px',
    paddingRight: '20px',
    fontSize: '20px',
    cursor: 'pointer',
};

interface Props {
    className?: string;
    onClick?: () => void;
}

/**
 * A component that displays a message onto a content script when the context extension is invalidated.
 */
export function ContextInvalidated(props: Props): JSX.Element | null {
    const [isShowing, setIsShowing] = useState(true);

    const hide = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
        setIsShowing(false);
    };

    const reload = () => {
        window.location.reload();
    };

    return isShowing ? (
        <div
            style={{
                ...containerStyle,
            }}
            id='extension-context-invalidated'
            className={props.className}
            onClick={props.onClick ?? reload}
        >
            Context Extension Context invalidated. Click to reload
            <div style={closeButtonStyle} onClick={hide}>
                ✕
            </div>
        </div>
    ) : null;
}
