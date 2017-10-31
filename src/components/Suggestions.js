import React from 'react';
import PropTypes from 'prop-types';

export default class Suggestions extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            activeValue: null
        }
    }

    handleOptionClick (value) {
        this.setState({ activeValue: value });
    }

    async handleSuggestion (value) {
        await this.props.onSuggestion(value);
        await this.setState({ activeValue: null });
    }

    render () {
        const options = this.props.children.map(child => {
            return React.cloneElement(child, {
                key: child.props.value,
                id: child.key,
                handleClick: this.handleOptionClick.bind(this, child.key),
                handleSuggestion: this.handleSuggestion.bind(this, child.key),
                active: this.state.activeValue
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


