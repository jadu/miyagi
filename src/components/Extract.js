import React from 'react';
import PropTypes from 'prop-types';

function replaceCharacters (text, original, replacement) {
    const re = new RegExp(`\\${original}`, 'gi');

    return text.replace(re, replacement);
}

export default function Extract ({ text }) {
    const parsedText = text.split(/\n/g)
        .map((line, index) =>
            <p key={line.slice(0, 5) + index} className="extract__copy">{ replaceCharacters(line, '*', '█') }</p>
        );

    return (
        <div className="extract">
            <div className="extract__container">
                <div className="extract__text">
                    { parsedText }
                </div>
            </div>
        </div>
    )
}

Extract.propTypes = {
    text: PropTypes.string.isRequired
}
