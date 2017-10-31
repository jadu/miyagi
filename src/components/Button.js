import React from 'react';
import PropTypes from 'prop-types';

export default class Button extends React.Component {
    render() {
        const { modifiers, onClick, icon, value } = this.props;
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
                <span ref="label" className="button__label">{value}</span>
            </button>
        );
    }
};

Button.propTtypes = {
    value: PropTypes.string.isRequired,
    icon: PropTypes.string,
    onClick: PropTypes.func,
    modifiers: PropTypes.array,
    active: PropTypes.bool
}
