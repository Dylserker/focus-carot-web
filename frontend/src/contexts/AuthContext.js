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
            const userData = { email: credentials.email, id: 1 };

            setCurrentUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));

            return true;
        } catch (error) {
            console.error('Erreur de connexion:', error);
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
        logout,
        isAuthenticated: !!currentUser
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}