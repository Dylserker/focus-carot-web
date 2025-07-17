import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService, User, LoginResponse } from '../services/api';
import { useRouter } from 'expo-router';

type AuthContextType = {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
    register: (name: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
    logout: () => Promise<void>;
    updateUser: (userData: Partial<User>) => Promise<{ success: boolean; message?: string }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
    }
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadUserFromStorage = async () => {
            try {
                const userString = await AsyncStorage.getItem('user');
                const token = await AsyncStorage.getItem('authToken');
                
                if (userString && token) {
                    const userData = JSON.parse(userString);
                    setUser(userData);
                    
                    // Vérifier si le token est toujours valide
                    const profileResponse = await apiService.getProfile();
                    if (!profileResponse.success) {
                        // Token invalide, déconnecter l'utilisateur
                        await logout();
                    } else {
                        // Mettre à jour les données utilisateur
                        setUser(profileResponse.data!);
                        await AsyncStorage.setItem('user', JSON.stringify(profileResponse.data));
                    }
                }
            } catch (error) {
                console.error('Erreur lors du chargement de l\'utilisateur:', error);
                // En cas d'erreur, déconnecter l'utilisateur
                await logout();
            } finally {
                setIsLoading(false);
            }
        };

        loadUserFromStorage();
    }, []);

    const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
        try {
            setIsLoading(true);

            const response = await apiService.login(email, password);
            console.log('🔍 Réponse reçue dans AuthContext:', JSON.stringify(response, null, 2));
            
            if (response.success && (response as any).user && (response as any).token) {
                console.log('✅ Connexion réussie, données utilisateur:', (response as any).user);
                const userData = (response as any).user;
                const token = (response as any).token;
                
                // Sauvegarder le token et les données utilisateur
                await AsyncStorage.setItem('authToken', token);
                console.log("🔑 Token stocké après login :", token);
                await AsyncStorage.setItem('user', JSON.stringify(userData));
                
                setUser(userData);
                return { success: true };
            } else {
                console.log('❌ Échec de connexion:', response.error);
                return { 
                    success: false, 
                    message: response.error || 'Erreur de connexion' 
                };
            }
        } catch (error) {
            console.error('❌ Erreur de connexion:', error);
            return { 
                success: false, 
                message: 'Erreur de connexion au serveur' 
            };
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (name: string, email: string, password: string): Promise<{ success: boolean; message?: string }> => {
        try {
            setIsLoading(true);

            const response = await apiService.register(name, email, password);
            
            if (response.success && response.data) {
                const { user: userData, token } = response.data;
                
                // Sauvegarder le token et les données utilisateur
                await AsyncStorage.setItem('authToken', token);
                console.log("🔑 Token stocké après register :", token);
                await AsyncStorage.setItem('user', JSON.stringify(userData));
                
                setUser(userData);
                return { success: true };
            } else {
                return { 
                    success: false, 
                    message: response.error || 'Erreur d\'inscription' 
                };
            }
        } catch (error) {
            console.error('Erreur d\'inscription:', error);
            return { 
                success: false, 
                message: 'Erreur d\'inscription au serveur' 
            };
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async (): Promise<void> => {
        try {
            // Appeler l'API de déconnexion si l'utilisateur est connecté
            if (user) {
                await apiService.logout();
            }
        } catch (error) {
            console.error('Erreur lors de la déconnexion API:', error);
        } finally {
            // Nettoyer le stockage local
            await AsyncStorage.removeItem('authToken');
            await AsyncStorage.removeItem('user');
            setUser(null);
        }
    };

    const updateUser = async (userData: Partial<User>): Promise<{ success: boolean; message?: string }> => {
        try {
            const response = await apiService.updateProfile(userData);
            
            if (response.success && response.data) {
                const updatedUser = response.data;
                setUser(updatedUser);
                await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
                return { success: true };
            } else {
                return { 
                    success: false, 
                    message: response.error || 'Erreur de mise à jour' 
                };
            }
        } catch (error) {
            console.error('Erreur de mise à jour du profil:', error);
            return { 
                success: false, 
                message: 'Erreur de mise à jour du profil' 
            };
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            isLoading,
            isAuthenticated: !!user,
            login,
            register,
            logout,
            updateUser
        }}>
            {children}
        </AuthContext.Provider>
    );
};