import React from 'react';
import RegisterForm from '../components/Form/RegisterForm';
import './Register.css';

function Register() {
    return (
        <div className="register-page">
            <h1>Créer un compte</h1>
            <RegisterForm />
        </div>
    );
}

export default Register;