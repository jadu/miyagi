import React from 'react';
import PropTypes from 'prop-types';

export default class Suggestions extends React.Component {
    render () {
        const options = this.props.children.map(child => {
            return React.cloneElement(child, {
                key: child.props.value,
                handleClick: this.props.onSuggestion.bind(this, child.key)
            });
        });

        return (
            <div className="suggestions">
                { options }
            </div>
        )
    }
}

Suggestions.propTypes = {
    onSuggestion: PropTypes.func.isRequired
}


