import * as React from 'react';

export interface OptionsProps {
    children?: any;
}

export default function Options ({ children }: OptionsProps) {
    return (
        <div className="options">
            { children }
        </div>
    )
}
