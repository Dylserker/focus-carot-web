import React, { useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { Image } from 'expo-image';

export default function Home() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.replace('/screen/login');
        }
    }, [isAuthenticated]);

    if (!isAuthenticated || !user) {
        return null;
    }

    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground
                source={require('../../assets/images/background.jpg')}
                style={styles.backgroundImage}
            >
                <View style={styles.contentContainer}>
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
                </View>
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
    contentContainer: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 60,
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
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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