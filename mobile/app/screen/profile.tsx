import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ImageBackground, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../../src/context/AuthContext';
import { StatusBar } from 'expo-status-bar';
import { User } from '../../src/services/api';

const ProfileScreen = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        Alert.alert(
            'Déconnexion',
            'Êtes-vous sûr de vouloir vous déconnecter ?',
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Déconnexion',
                    style: 'destructive',
                    onPress: async () => {
                        setIsLoggingOut(true);
                        try {
                            await logout();
                        } catch (error) {
                            Alert.alert('Erreur', 'Erreur lors de la déconnexion');
                        } finally {
                            setIsLoggingOut(false);
                        }
                    }
                }
            ]
        );
    };

    if (!isAuthenticated || !user) {
        return (
            <View style={styles.container}>
                <StatusBar style="auto" />
                <ImageBackground
                    source={require('../../assets/images/background.jpg')}
                    style={styles.backgroundImage}
                >
                    <View style={styles.centerContainer}>
                        <Text style={styles.centerText}>Veuillez vous connecter pour voir votre profil</Text>
                    </View>
                </ImageBackground>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <ImageBackground
                source={require('../../assets/images/background.jpg')}
                style={styles.backgroundImage}
            >
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <View style={styles.profileHeader}>
                        <Text style={[styles.title, { color: '#fff' }]}>Mon Profil</Text>
                        <TouchableOpacity style={styles.imageContainer}>
                            {user.avatar ? (
                                <Image
                                    source={{ uri: user.avatar }}
                                    style={styles.profileImage}
                                />
                            ) : (
                                <View style={styles.placeholderImage}>
                                    <Text style={styles.placeholderText}>Photo</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>

                    <View style={styles.profileInfo}>
                        <View style={styles.infoItem}>
                            <Text style={styles.label}>Nom:</Text>
                            <Text style={styles.value}>{user.name}</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Text style={styles.label}>Email:</Text>
                            <Text style={styles.value}>{user.email}</Text>
                        </View>
                        {user.title && (
                            <View style={styles.infoItem}>
                                <Text style={styles.label}>Titre:</Text>
                                <Text style={styles.value}>{user.title}</Text>
                            </View>
                        )}
                        <View style={styles.infoItem}>
                            <Text style={styles.label}>Membre depuis:</Text>
                            <Text style={styles.value}>
                                {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                            </Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Text style={styles.label}>Dernière mise à jour:</Text>
                            <Text style={styles.value}>
                                {new Date(user.updatedAt).toLocaleDateString('fr-FR')}
                            </Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={[styles.logoutButton, isLoggingOut && styles.logoutButtonDisabled]}
                        onPress={handleLogout}
                        disabled={isLoggingOut}
                    >
                        {isLoggingOut ? (
                            <ActivityIndicator color="#fff" size="small" />
                        ) : (
                            <Text style={styles.logoutButtonText}>Se déconnecter</Text>
                        )}
                    </TouchableOpacity>
                </ScrollView>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    backgroundImage: {
        flex: 1,
        width: '100%',
    },
    scrollContainer: {
        padding: 20,
        paddingBottom: 80,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    centerText: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
    },
    profileHeader: {
        marginBottom: 30,
        alignItems: 'center',
    },
    imageContainer: {
        marginTop: 20,
        marginBottom: 20,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    placeholderImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    placeholderText: {
        color: '#fff',
        fontSize: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    profileInfo: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 10,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        marginBottom: 20,
    },
    infoItem: {
        marginBottom: 15,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: '#f0ad4e',
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#555',
        marginBottom: 5,
        textTransform: 'uppercase',
    },
    value: {
        fontSize: 16,
        color: '#333',
    },
    logoutButton: {
        backgroundColor: '#dc3545',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    logoutButtonDisabled: {
        backgroundColor: '#6c757d',
    },
    logoutButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ProfileScreen;