import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ImageBackground } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { StatusBar } from 'expo-status-bar';

const ProfileScreen = () => {
    const { user } = useAuth();

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
                            {user?.photoUrl ? (
                                <Image
                                    source={{ uri: user.photoUrl }}
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
                        {user ? (
                            <>
                                <View style={styles.infoItem}>
                                    <Text style={styles.label}>Titre:</Text>
                                    <Text style={styles.value}>{user.title || 'Non défini'}</Text>
                                </View>
                                <View style={styles.infoItem}>
                                    <Text style={styles.label}>Pseudo:</Text>
                                    <Text style={styles.value}>{user.username}</Text>
                                </View>
                                <View style={styles.infoItem}>
                                    <Text style={styles.label}>Prénom:</Text>
                                    <Text style={styles.value}>{user.firstName}</Text>
                                </View>
                                <View style={styles.infoItem}>
                                    <Text style={styles.label}>Nom:</Text>
                                    <Text style={styles.value}>{user.lastName}</Text>
                                </View>
                                <View style={styles.infoItem}>
                                    <Text style={styles.label}>Date de naissance:</Text>
                                    <Text style={styles.value}>
                                        {new Date(user.birthDate).toLocaleDateString('fr-FR')}
                                    </Text>
                                </View>
                                <View style={styles.infoItem}>
                                    <Text style={styles.label}>Email:</Text>
                                    <Text style={styles.value}>{user.email}</Text>
                                </View>
                                <View style={styles.infoItem}>
                                    <Text style={styles.label}>Mot de passe:</Text>
                                    <Text style={styles.value}>••••••••</Text>
                                </View>
                            </>
                        ) : (
                            <Text style={styles.notLoggedIn}>
                                Vous n'êtes pas connecté.
                            </Text>
                        )}
                    </View>
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
        backgroundColor: '#e1e1e1',
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        color: '#666',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    profileInfo: {
        backgroundColor: '#f8f8f8',
        borderRadius: 10,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    infoItem: {
        marginBottom: 15,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#555',
        marginBottom: 5,
    },
    value: {
        fontSize: 16,
        color: '#333',
    },
    notLoggedIn: {
        fontSize: 16,
        color: '#ff6347',
        textAlign: 'center',
    },
});

export default ProfileScreen;