import React from 'react';
import PropTypes from 'prop-types';

export default function Extract ({ text }) {
    const parsedText = text.split(/\n/g)
        .map((line, index) =>
            <p key={line.slice(0, 5) + index} className="extract__copy">{ line }</p>
        );

    return (
        <div className="extract">
            <div className="extract__container">
                { parsedText }
            </div>
        </div>
    )
}

Extract.propTypes = {
    text: PropTypes.string.isRequired
}
