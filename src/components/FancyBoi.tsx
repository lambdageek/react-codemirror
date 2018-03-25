import * as React from 'react';

import './FancyBoi.css';

export interface Props {
    style?: React.CSSProperties;
    children?: React.ReactNode;
}

export default function FancyBoi (props: Props) {
    return (
        <div className="FancyBoi" style={props.style}>
          {props.children}
        </div>
    );
}