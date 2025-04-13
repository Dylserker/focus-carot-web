import React from 'react';

const Button = ({
    type = 'button',
    variant = 'primary',
    size = 'medium',
    className =  '',
    disabled = false,
    onClick,
    children,
    ...restProps
}) => {
    const baseClasses = 'btn';

    const variantClasses = {
        primary: 'btn-primary',
        secondary: 'btn-secondary',
        outline: 'btn-outline',
        danger: 'btn-danger',
        success: 'btn-success',
    };

    const sizeClasses = {
        small: 'btn-sm',
        medium: 'btn-md',
        large: 'btn-lg',
    };

    const buttonClasses = [
        baseClasses,
        variantClasses[variant] || variantClasses.primary,
        sizeClasses[size] || sizeClasses.medium,
        className,
    ].join(' ');

    return (
        <button
            type={type}
            className={buttonClasses}
            disabled={disabled}
            onClick={onClick}
            {...restProps}
        >
            {children}
        </button>
    );
};

export default Button