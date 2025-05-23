import React from 'react';

const Input = ({
    type = 'text',
    variant = 'primary',
    size = 'medium',
    className = '',
    disabled = false,
    placeholder = '',
    value = '',
    onChange,
    name = '',
    id = '',
    autoComplete = '',
    ...restProps
}) => {
    const baseClasses = 'input';

    const variantClasses = {
        primary: 'input-primary',
        secondary: 'input-secondary',
        outline: 'input-outline',
        danger: 'input-danger',
        success: 'input-success',
    };

    const sizeClasses = {
        small: 'input-sm',
        medium: 'input-md',
        large: 'input-lg',
    };

    const inputClasses = [
        baseClasses,
        variantClasses[variant] || variantClasses.primary,
        sizeClasses[size] || sizeClasses.medium,
        className,
    ].join(' ');

    return (
        <input
            type={type}
            className={inputClasses}
            disabled={disabled}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            name={name}
            id={id}
            autoComplete={autoComplete}
            {...restProps}
        />
    );
};

export default Input;