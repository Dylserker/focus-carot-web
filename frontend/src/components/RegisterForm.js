import React, { useState } from 'react';
import './RegisterForm.css';

function RegisterForm() {
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        pseudo: '',
        motDePasse: '',
        confirmationMotDePasse: ''
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const validateForm = () => {
        let tempErrors = {};
        let isValid = true;

        if (!formData.nom.trim()) {
            tempErrors.nom = "Le nom est requis";
            isValid = false;
        }

        if (!formData.prenom.trim()) {
            tempErrors.prenom = "Le prénom est requis";
            isValid = false;
        }

        if (!formData.pseudo.trim()) {
            tempErrors.pseudo = "Le pseudo est requis";
            isValid = false;
        }

        if (!formData.motDePasse) {
            tempErrors.motDePasse = "Le mot de passe est requis";
            isValid = false;
        } else if (formData.motDePasse.length < 6) {
            tempErrors.motDePasse = "Le mot de passe doit contenir au moins 6 caractères";
            isValid = false;
        }

        if (formData.confirmationMotDePasse !== formData.motDePasse) {
            tempErrors.confirmationMotDePasse = "Les mots de passe ne correspondent pas";
            isValid = false;
        }

        setErrors(tempErrors);
        return isValid;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            console.log("Données du formulaire soumises:", formData);

            setFormData({
                nom: '',
                prenom: '',
                pseudo: '',
                motDePasse: '',
                confirmationMotDePasse: ''
            });
        }
    };

    return (
        <div className="inscription-container">
            <h2>Inscription</h2>
            <form onSubmit={handleSubmit} className="inscription-form">
                <div className="form-group">
                    <label htmlFor="nom">Nom</label>
                    <input
                        type="text"
                        id="nom"
                        name="nom"
                        value={formData.nom}
                        onChange={handleChange}
                        className={errors.nom ? "input-error" : ""}
                    />
                    {errors.nom && <span className="error-message">{errors.nom}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="prenom">Prénom</label>
                    <input
                        type="text"
                        id="prenom"
                        name="prenom"
                        value={formData.prenom}
                        onChange={handleChange}
                        className={errors.prenom ? "input-error" : ""}
                    />
                    {errors.prenom && <span className="error-message">{errors.prenom}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="pseudo">Pseudo</label>
                    <input
                        type="text"
                        id="pseudo"
                        name="pseudo"
                        value={formData.pseudo}
                        onChange={handleChange}
                        className={errors.pseudo ? "input-error" : ""}
                    />
                    {errors.pseudo && <span className="error-message">{errors.pseudo}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="motDePasse">Mot de passe</label>
                    <input
                        type="password"
                        id="motDePasse"
                        name="motDePasse"
                        value={formData.motDePasse}
                        onChange={handleChange}
                        className={errors.motDePasse ? "input-error" : ""}
                    />
                    {errors.motDePasse && <span className="error-message">{errors.motDePasse}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="confirmationMotDePasse">Confirmation du mot de passe</label>
                    <input
                        type="password"
                        id="confirmationMotDePasse"
                        name="confirmationMotDePasse"
                        value={formData.confirmationMotDePasse}
                        onChange={handleChange}
                        className={errors.confirmationMotDePasse ? "input-error" : ""}
                    />
                    {errors.confirmationMotDePasse && (
                        <span className="error-message">{errors.confirmationMotDePasse}</span>
                    )}
                </div>

                <button type="submit" className="inscription-button">Inscription</button>
            </form>
        </div>
    );
}

export default RegisterForm;