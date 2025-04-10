import React from 'react';
import Button from '../Button/Button';
import './FormFooter.css';

function FormFooter({ handleLoginClick }) {
    return (
        <div className="form-actions">
            <Button type="submit" className="submit-button">S'inscrire</Button>
            <p className="login-link">
                Déjà un compte? <Button type="button" onClick={handleLoginClick} className="login-button">Se connecter</Button>
            </p>
        </div>
    );
}

export default FormFooter;