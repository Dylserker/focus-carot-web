import React from 'react';
import './Button.css';

function Button({ type = 'button', onClick, className = '', children }) {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`custom-button ${className}`}
        >
            {children}
        </button>
    );
}

export default Button;