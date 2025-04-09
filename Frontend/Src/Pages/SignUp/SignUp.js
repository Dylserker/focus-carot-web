import React from 'react';
import './SignUp.css';

function SignUp() {
    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Formulaire soumis (démo Frontend uniquement)');
    };

    return (
        <div className="signup-container">
            <h2>Inscription</h2>
            <form onSubmit={handleSubmit} className="signup-form">
                <div className="form-group">
                    <label htmlFor="nom">Nom</label>
                    <input type="text" id="nom" name="nom" />
                </div>

                <div className="form-group">
                    <label htmlFor="prenom">Prénom</label>
                    <input type="text" id="prenom" name="prenom" />
                </div>

                <div className="form-group">
                    <label htmlFor="pseudo">Pseudo</label>
                    <input type="text" id="pseudo" name="pseudo" />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" />
                </div>

                <div className="form-group">
                    <label htmlFor="motDePasse">Mot de passe</label>
                    <input type="password" id="motDePasse" name="motDePasse" />
                </div>

                <div className="form-group">
                    <label htmlFor="confirmationMotDePasse">Confirmation du mot de passe</label>
                    <input type="password" id="confirmationMotDePasse" name="confirmationMotDePasse" />
                </div>

                <button type="submit" className="submit-button">S'inscrire</button>
            </form>
        </div>
    );
}

export default SignUp;