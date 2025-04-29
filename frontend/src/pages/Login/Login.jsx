import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../component/Input';
import Button from '../../component/Button';
import { useAuth } from '../../contexts/AuthContext';
import './Login.css';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const { login } = useAuth();
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

        try {
            const success = await login(formData);
            if (success) {
                navigate('/home');
            }
        } catch (err) {
            setError('Échec de la connexion. Veuillez vérifier vos identifiants.');
            console.error('Erreur de connexion:', err);
        }
    };

    return (
        <div className="login-container">
            <div className="login-form-wrapper">
                <h2>Connexion</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
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
                            placeholder="Entrez votre mot de passe"
                            required
                        />
                    </div>

                    <div className="form-submit">
                        <Button
                            type="submit"
                            variant="primary"
                            size="large"
                        >
                            Se connecter
                        </Button>
                    </div>

                    <div className="form-footer">
                        <p>Si je n'ai pas de compte: <Link to="/register">Cliquez ici</Link></p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;