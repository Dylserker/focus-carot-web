import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../component/Input';
import Button from '../../component/Button';
import { useAuth } from '../../contexts/AuthContext';
import './Register.css';

const Register = () => {
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        pseudo: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            return;
        }

        try {
            const userData = {
                nom: formData.nom,
                prenom: formData.prenom,
                pseudo: formData.pseudo,
                email: formData.email,
                password: formData.password
            };

            const success = await register(userData);
            if (success) {
                navigate('/home');
            }
        } catch (err) {
            setError('Échec de l\'inscription. Veuillez réessayer.');
            console.error('Erreur d\'inscription:', err);
        }
    };

    return (
        <div className="register-container">
            <div className="register-form-wrapper">
                <h2>Créer un compte</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="nom">Nom</label>
                        <Input
                            type="text"
                            id="nom"
                            name="nom"
                            value={formData.nom}
                            onChange={handleChange}
                            placeholder="Entrez votre nom"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="prenom">Prénom</label>
                        <Input
                            type="text"
                            id="prenom"
                            name="prenom"
                            value={formData.prenom}
                            onChange={handleChange}
                            placeholder="Entrez votre prénom"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="pseudo">Pseudo</label>
                        <Input
                            type="text"
                            id="pseudo"
                            name="pseudo"
                            value={formData.pseudo}
                            onChange={handleChange}
                            placeholder="Choisissez un pseudo"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <Input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Entrez votre email"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Mot de passe</label>
                        <Input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Créez un mot de passe"
                            autoComplete="current-password"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirmation du mot de passe</label>
                        <Input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirmez votre mot de passe"
                            autoComplete="current-password"
                            required
                        />
                    </div>

                    <div className="form-submit">
                        <Button
                            type="submit"
                            variant="primary"
                            size="large"
                        >
                            S'inscrire
                        </Button>
                    </div>

                    <div className="form-footer">
                        <p>Si vous avez déjà un compte: <Link to="/login">Cliquez ici</Link></p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;