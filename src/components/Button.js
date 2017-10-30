import React from 'react';

export default function Button ({ icon, value, handleClick }) {
    const modifier = value.toLowerCase().trim().replace(/\s/g, '-');

    return (
        <button className={`button button--${value}`} onClick={handleClick}>
            { icon && <span className="button__icon">{ icon }</span> }
            <span className="button__label">{ value }</span>
        </button>
    )
};
