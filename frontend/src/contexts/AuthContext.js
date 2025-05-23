import React, { createContext, useContext, useState, useEffect } from 'react';
import ExperienceService from '../services/ExperienceService';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const updateUserProgress = (progression) => {
        setCurrentUser(prev => ({
            ...prev,
            level: progression.level,
            progress: progression.progress
        }));
    };
    const gainExperience = async (amount) => {
        if (!currentUser) return;
        try {
            const progression = await ExperienceService.updateExperience(currentUser.id, amount);
            updateUserProgress(progression);
        } catch (error) {
            console.error('Erreur:', error);
        }
    };

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
            const response = await fetch('http://localhost:8000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erreur d\'inscription');
            }

            const user = {
                ...data.user,
                token: data.token
            };

            setCurrentUser(user);
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('token', data.token);

            return true;
        } catch (error) {
            console.error('Erreur d\'inscription:', error);
            throw error;
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
        isAuthenticated: !!currentUser,
        gainExperience
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}