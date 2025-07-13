import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';

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
            progression: progression
        }));
    };

    const gainExperience = async (amount) => {
        if (!currentUser) return;
        try {
            const response = await apiService.addUserExperience(currentUser._id, amount);
            if (response.success) {
                updateUserProgress(response.progression);
                await refreshUser();
                

            }
        } catch (error) {
            console.error('Erreur lors de l\'ajout d\'expérience:', error);
        }
    };

    // Vérifier le token au démarrage
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');
            
            if (token && storedUser) {
                try {
                    // Vérifier si le token est toujours valide
                    const response = await apiService.verifyToken();
                    if (response.success) {
                        setCurrentUser(response.user);
                    } else {
                        // Token invalide, nettoyer le localStorage
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                    }
                } catch (error) {
                    console.error('Erreur de vérification du token:', error);
                    // Token invalide, nettoyer le localStorage
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    async function login(credentials) {
        try {
            const response = await apiService.login(credentials);

            if (response.success) {
                const userData = {
                    ...response.user,
                    token: response.token
                };

                setCurrentUser(userData);
                localStorage.setItem('user', JSON.stringify(userData));
                localStorage.setItem('token', response.token);

                return true;
            } else {
                throw new Error(response.message || 'Erreur de connexion');
            }
        } catch (error) {
            console.error('Erreur de connexion:', error);
            throw error;
        }
    }

    async function register(userData) {
        try {
            const response = await apiService.register(userData);

            if (response.success) {
                const user = {
                    ...response.user,
                    token: response.token
                };

                setCurrentUser(user);
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('token', response.token);

                return true;
            } else {
                throw new Error(response.message || 'Erreur d\'inscription');
            }
        } catch (error) {
            console.error('Erreur d\'inscription:', error);
            throw error;
        }
    }

    function logout() {
        setCurrentUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    }

    // Mettre à jour les informations utilisateur
    const updateUser = (userData) => {
        setCurrentUser(prev => ({
            ...prev,
            ...userData
        }));
        localStorage.setItem('user', JSON.stringify({
            ...currentUser,
            ...userData
        }));
    };

    // Rafraîchir les données utilisateur depuis le serveur
    const refreshUser = async () => {
        if (!currentUser?._id) return;
        
        try {
            const response = await apiService.getUser(currentUser._id);
            if (response.success) {
                const updatedUser = {
                    ...currentUser,
                    ...response.user
                };
                setCurrentUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
            }
        } catch (error) {
            console.error('Erreur lors du rafraîchissement des données utilisateur:', error);
        }
    };

    const value = {
        currentUser,
        login,
        register,
        logout,
        updateUser,
        refreshUser,
        isAuthenticated: !!currentUser,
        gainExperience,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}