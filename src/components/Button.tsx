import * as React from 'react';

export interface ButtonProps {
    value: string;
    modifiers?: string[];
    onClick?: () => void;
    icon?: string;
    id?: string;
    active?: boolean;
}

export default class Button extends React.Component<ButtonProps, {}> {
    render() {
        const { modifiers, onClick, icon, value, id } = this.props;
        const active = this.props.active !== undefined ? this.props.active : true;
        const className = 'button '
            + (modifiers ? modifiers.join(' ') : '')
            + (active ? '' : ' disabled');

        return (
            <button
                className={className}
                onClick={onClick && onClick.bind(this, this.refs.label)}
            >
                { icon && <img className="button__icon" src={icon}/> }
                <span id={id} ref="label" className="button__label">{value}</span>
            </button>
        );
    }
};
