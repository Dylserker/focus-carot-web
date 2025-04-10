import React from 'react';
import Button from '../Button/Button';

function FormFooter({ handleLoginClick }) {
    return (
        <div className="form-actions">
            <Button type="submit" className="submit-button">S'inscrire</Button>
            <p className="login-link">
                Déjà un compte? <button type="button" onClick={handleLoginClick}>Se connecter</button>
            </p>
        </div>
    );
}

export default FormFooter;