import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    async function login(credentials) {
        try {
            const response = await fetch('http://localhost:8000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erreur de connexion');
            }

            const userData = {
                ...data.user,
                token: data.token
            };

            setCurrentUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('token', data.token);

            return true;
        } catch (error) {
            console.error('Erreur de connexion:', error);
            throw error;
        }
    }

    async function register(userData) {
        try {
            const newUser = {
                email: userData.email,
                id: Math.floor(Math.random() * 1000),
                nom: userData.nom,
                prenom: userData.prenom,
                pseudo: userData.pseudo
            };

            setCurrentUser(newUser);
            localStorage.setItem('user', JSON.stringify(newUser));

            return true;
        } catch (error) {
            console.error('Erreur d\'inscription:', error);
            return false;
        }
    }

    function logout() {
        setCurrentUser(null);
        localStorage.removeItem('user');
    }

    const value = {
        currentUser,
        login,
        register,
        logout,
        isAuthenticated: !!currentUser
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}