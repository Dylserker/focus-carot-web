import React, { useState } from 'react';
import './RegisterForm.css';
import FormInput from './FormInput';
import FormFooter from './FormFooter';

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

    const handleLoginClick = () => {
        console.log("Redirection vers la page de connexion");
    };

    return (
        <div className="inscription-container">
            <form onSubmit={handleSubmit} className="inscription-form">
                <FormInput
                    id="nom"
                    label="Nom"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    error={errors.nom}
                />

                <FormInput
                    id="prenom"
                    label="Prénom"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleChange}
                    error={errors.prenom}
                />

                <FormInput
                    id="pseudo"
                    label="Pseudo"
                    name="pseudo"
                    value={formData.pseudo}
                    onChange={handleChange}
                    error={errors.pseudo}
                />

                <FormInput
                    id="motDePasse"
                    label="Mot de passe"
                    type="password"
                    name="motDePasse"
                    value={formData.motDePasse}
                    onChange={handleChange}
                    error={errors.motDePasse}
                />

                <FormInput
                    id="confirmationMotDePasse"
                    label="Confirmer le mot de passe"
                    type="password"
                    name="confirmationMotDePasse"
                    value={formData.confirmationMotDePasse}
                    onChange={handleChange}
                    error={errors.confirmationMotDePasse}
                />

                <FormFooter handleLoginClick={handleLoginClick} />
            </form>
        </div>
    );
}

export default RegisterForm;