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
                <p className="extract__help">
                    Read the extract below and let Miyagi know what you think the sentiment of the message is. There is no right or wrong answer, if you are unsure we'll send you another one.
                </p>
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
