import React, { useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ImageBackground, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { apiService } from '../../src/services/api';
import { Image } from 'expo-image';

export default function Home() {
    const { user, isAuthenticated, isLoading, updateUser, logout } = useAuth();
    const router = useRouter();

    // Rafraîchir le profil utilisateur à chaque affichage
    useEffect(() => {
        const refreshProfile = async () => {
            const userId = user && (user._id || user.id);
            if (isAuthenticated && userId) {
                const response = await apiService.getProfile(userId);
                if (response.success && response.data) {
                    updateUser(response.data);
                } else if (!response.success && response.error) {
                    // Si le token est invalide, déconnecter
                    await logout();
                }
            }
        };
        refreshProfile();
    }, [isAuthenticated, user]);

    useEffect(() => {
        if (!isLoading && (!isAuthenticated || !user)) {
            router.replace('/screen/login');
        }
    }, [isLoading, isAuthenticated, user]);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
                <ActivityIndicator size="large" color="#f0ad4e" />
            </View>
        );
    }

    if (!isAuthenticated || !user) {
        return null;
    }

    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground
                source={require('../../assets/images/background.jpg')}
                style={styles.backgroundImage}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.welcomeSection}>
                        <Text style={styles.title}>Bienvenue, {user.name}!</Text>
                        <Text style={styles.subtitle}>
                            Prêt à accomplir vos objectifs aujourd'hui ?
                        </Text>
                    </View>

                    <View style={styles.statsSection}>
                        <View style={styles.statCard}>
                            <Text style={styles.statNumber}>📋</Text>
                            <Text style={styles.statLabel}>Tâches</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Text style={styles.statNumber}>🏆</Text>
                            <Text style={styles.statLabel}>Succès</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Text style={styles.statNumber}>⭐</Text>
                            <Text style={styles.statLabel}>Points</Text>
                        </View>
                    </View>

                    <View style={styles.gifContainer}>
                        <Image
                            source={require('../../assets/gif/rabbit-home.gif')}
                            style={styles.gif}
                            contentFit="contain"
                            transition={100}
                        />
                    </View>

                    <View style={styles.quickActions}>
                        <TouchableOpacity 
                            style={styles.actionButton}
                            onPress={() => router.push('/screen/tasks')}
                        >
                            <Text style={styles.actionButtonText}>📝 Mes Tâches</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={styles.actionButton}
                            onPress={() => router.push('/screen/achievements')}
                        >
                            <Text style={styles.actionButtonText}>🏆 Mes Succès</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </ImageBackground>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    backgroundImage: {
        flex: 1,
        width: '100%',
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 80, // pour laisser la place au Footer
        justifyContent: 'flex-start',
    },
    welcomeSection: {
        alignItems: 'center',
        marginBottom: 30,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 10,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    subtitle: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
        opacity: 0.9,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    statsSection: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 30,
    },
    statCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 15,
        padding: 20,
        alignItems: 'center',
        minWidth: 80,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    statNumber: {
        fontSize: 24,
        marginBottom: 5,
    },
    statLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#666',
        textAlign: 'center',
    },
    gifContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    gif: {
        width: 200,
        height: 200,
    },
    quickActions: {
        marginBottom: 40,
    },
    actionButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 12,
        padding: 15,
        marginBottom: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    actionButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
});