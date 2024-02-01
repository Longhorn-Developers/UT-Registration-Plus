import classnames from 'classnames';
import React from 'react';
import { Color } from '@views/styles/colors.module.scss';
import styles from './Dropdown.module.scss';

export type Props = {
    color?: Color | React.CSSProperties['borderColor'];
    style?: React.CSSProperties;
    className?: string;
    testId?: string;
};

/**
 * This is a reusable dropdown component that can be used to toggle the visiblity of information
 */
export default function Dropdown(props: Props) {
    const [show, toggle] = React.useState(false);
    const toggleSwitch = () => {
        toggle(!show);
    }
    
    return (
        <button
            style={props.style} 
            data-testid={props.testId} 
            className={classnames(styles.dropdown, props.className)}

            onClick={toggleSwitch}
        >
        Dropdown
        {show ? (
            <ul className="menu">
                <li className="item">
                    <button>Menu 1</button>
                </li>
                <li className="item">
                    <button>Menu 2</button>
                </li>
            </ul>
        )
         : null}
         {open ? <div>Is Open</div> : <div>Is Closed</div>}
        </button>
    );
}
