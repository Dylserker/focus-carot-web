import React, { useState } from 'react';
import Button from './Button';
import Input from './Input';

const Form = ({
                  onSubmit,
                  fields = [],
                  submitLabel = 'Soumettre',
                  initialValues = {},
                  className = ''
              }) => {
    const [formData, setFormData] = useState(initialValues);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: null
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        let isValid = true;

        fields.forEach(field => {
            if (field.required && !formData[field.name]) {
                newErrors[field.name] = `${field.label} est requis`;
                isValid = false;
            }

            if (field.validate && formData[field.name]) {
                const fieldError = field.validate(formData[field.name]);
                if (fieldError) {
                    newErrors[field.name] = fieldError;
                    isValid = false;
                }
            }
        });

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            onSubmit(formData);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={`form ${className}`}>
            {fields.map((field) => (
                <div key={field.name} className="form-field">
                    <Input
                        type={field.type || 'text'}
                        name={field.name}
                        label={field.label}
                        value={formData[field.name] || ''}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        required={field.required}
                        error={errors[field.name]}
                        {...field.props}
                    />
                </div>
            ))}

            <div className="form-actions">
                <Button type="submit">{submitLabel}</Button>
            </div>
        </form>
    );
};

export default Form;