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
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await login(formData);
            navigate('/home');
        } catch (err) {
            setError(err.message || 'Échec de la connexion. Veuillez vérifier vos identifiants.');
        } finally {
            setIsLoading(false);
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
                            disabled={isLoading}
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
                            autoComplete="current-password"
                            disabled={isLoading}
                            required
                        />
                    </div>

                    <div className="form-submit">
                        <Button
                            type="submit"
                            variant="primary"
                            size="large"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Connexion...' : 'Se connecter'}
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