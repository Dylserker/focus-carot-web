import React from 'react';

function FormInput({ id, label, type, name, value, onChange, error }) {
    return (
        <div className="form-group">
            <label htmlFor={id}>{label}</label>
            <input
                type={type || "text"}
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                className={error ? "input-error" : ""}
            />
            {error && <span className="error-message">{error}</span>}
        </div>
    );
}

export default FormInput;